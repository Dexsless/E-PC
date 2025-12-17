import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Component, PCBuild, ComponentType } from '../types/component';
import { Cpu, MonitorPlay, HardDrive, CircuitBoard, Database, Zap, Box, Fan, Search } from 'lucide-react';

const BUDGET_ALLOCATION = {
  CPU: 0.25,
  GPU: 0.30,
  RAM: 0.10,
  Motherboard: 0.12,
  Storage: 0.08,
  PSU: 0.07,
  Case: 0.05,
  Cooler: 0.03,
};

const COMPONENT_ICONS = {
  CPU: Cpu,
  GPU: MonitorPlay,
  RAM: HardDrive,
  Motherboard: CircuitBoard,
  Storage: Database,
  PSU: Zap,
  Case: Box,
  Cooler: Fan,
};

export default function PCBuilder() {
  const [budget, setBudget] = useState('');
  const [components, setComponents] = useState<Component[]>([]);
  const [recommendation, setRecommendation] = useState<PCBuild | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching components:', error);
    } else {
      setComponents(data || []);
    }
  };

  const findBestComponent = (type: ComponentType, maxPrice: number): Component | undefined => {
    const typeComponents = components.filter(c => c.type === type && c.price <= maxPrice);

    if (typeComponents.length === 0) {
      return components.filter(c => c.type === type)[0];
    }

    return typeComponents.reduce((best, current) => {
      const bestDiff = maxPrice - best.price;
      const currentDiff = maxPrice - current.price;
      return currentDiff < bestDiff ? current : best;
    });
  };

  const generateRecommendation = () => {
    if (!budget || parseFloat(budget) <= 0) {
      alert('Masukkan budget yang valid!');
      return;
    }

    setLoading(true);
    const totalBudget = parseFloat(budget);
    const build: PCBuild = { totalPrice: 0 };

    Object.entries(BUDGET_ALLOCATION).forEach(([type, allocation]) => {
      const maxPrice = totalBudget * allocation;
      const component = findBestComponent(type as ComponentType, maxPrice);
      if (component) {
        const key = type.toLowerCase() as keyof Omit<PCBuild, 'totalPrice'>;
        build[key] = component;
        build.totalPrice += component.price;
      }
    });

    setRecommendation(build);
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const budgetSuggestions = [5000000, 8000000, 12000000, 15000000, 20000000, 30000000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            PC Builder Indonesia
          </h1>
          <p className="text-xl text-slate-300">
            Dapatkan rekomendasi komponen PC terbaik sesuai budget Anda
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="max-w-3xl mx-auto">
            <label className="block text-white text-lg font-semibold mb-4">
              Masukkan Budget Anda (IDR)
            </label>
            <div className="flex gap-4 mb-4">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Contoh: 10000000"
                className="flex-1 px-6 py-4 text-lg rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all outline-none"
              />
              <button
                onClick={generateRecommendation}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search size={24} />
                {loading ? 'Memproses...' : 'Cari Rekomendasi'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-slate-300 text-sm">Budget Populer:</span>
              {budgetSuggestions.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBudget(amount.toString())}
                  className="px-4 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors"
                >
                  {formatPrice(amount)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {recommendation && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Total Estimasi Biaya</h2>
                  <p className="text-slate-300">Budget Anda: {formatPrice(parseFloat(budget))}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-green-400">
                    {formatPrice(recommendation.totalPrice)}
                  </div>
                  <div className="text-sm text-slate-300 mt-1">
                    {recommendation.totalPrice <= parseFloat(budget) ? (
                      <span className="text-green-400">Sesuai Budget</span>
                    ) : (
                      <span className="text-red-400">
                        Lebih {formatPrice(recommendation.totalPrice - parseFloat(budget))}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(recommendation).map(([key, component]) => {
                if (key === 'totalPrice' || !component) return null;

                const type = component.type;
                const Icon = COMPONENT_ICONS[type as keyof typeof COMPONENT_ICONS] ?? Box;
                const allocation = BUDGET_ALLOCATION[type as keyof typeof BUDGET_ALLOCATION] ?? 0;
                const maxPrice = parseFloat(budget) * allocation;

                return (
                  <div
                    key={component.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border-2 border-slate-200"
                  >
                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden relative">
                      <img
                        src={component.image_url}
                        alt={component.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-2">
                        <Icon size={16} className="text-blue-400" />
                        <span className="text-white text-sm font-semibold">{type}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-800 text-lg mb-2 leading-tight">
                        {component.name}
                      </h3>

                      {component.specs && (
                        <p className="text-sm text-slate-600 mb-2">{component.specs}</p>
                      )}

                      {component.description && (
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                          {component.description}
                        </p>
                      )}

                      <div className="space-y-2 pt-3 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Harga</span>
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(component.price)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Alokasi Budget</span>
                          <span className="text-slate-600 font-medium">
                            {formatPrice(maxPrice)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${component.price <= maxPrice ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            style={{
                              width: `${Math.min((component.price / maxPrice) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {components.length === 0 && (
              <div className="bg-yellow-500/20 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/50">
                <p className="text-yellow-200 text-center">
                  Belum ada komponen di database. Silakan tambahkan komponen melalui Admin Panel terlebih dahulu.
                </p>
              </div>
            )}
          </div>
        )}

        {!recommendation && components.length > 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🖥️</div>
            <p className="text-2xl text-slate-300 mb-4">
              Masukkan budget Anda untuk mendapatkan rekomendasi
            </p>
            <p className="text-slate-400">
              Kami akan memberikan rekomendasi komponen terbaik sesuai anggaran Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
