import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Activity, Clock, TrendingUp, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface Monitor {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'warning' | 'critical';
  last_updated: string;
  uptime_percentage: number;
  response_time: number;
}

const STATUS_CONFIG = {
  active: {
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgLight: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    label: 'Active',
  },
  warning: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgLight: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: AlertTriangle,
    label: 'Warning',
  },
  critical: {
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgLight: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: AlertCircle,
    label: 'Critical',
  },
};

export default function MonitorPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMonitors: 0,
    activeCount: 0,
    warningCount: 0,
    criticalCount: 0,
    avgUptime: 0,
  });

  useEffect(() => {
    fetchMonitors();
    const interval = setInterval(fetchMonitors, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMonitors = async () => {
    const { data, error } = await supabase
      .from('monitors')
      .select('*')
      .order('status', { ascending: false })
      .order('title');

    if (!error && data) {
      setMonitors(data);
      calculateStats(data);
    }
    setLoading(false);
  };

  const calculateStats = (data: Monitor[]) => {
    const activeCount = data.filter(m => m.status === 'active').length;
    const warningCount = data.filter(m => m.status === 'warning').length;
    const criticalCount = data.filter(m => m.status === 'critical').length;
    const avgUptime = data.length > 0
      ? data.reduce((sum, m) => sum + Number(m.uptime_percentage), 0) / data.length
      : 0;

    setStats({
      totalMonitors: data.length,
      activeCount,
      warningCount,
      criticalCount,
      avgUptime,
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const getResponseTimeColor = (ms: number) => {
    if (ms < 100) return 'text-green-600';
    if (ms < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Activity className="text-white" size={28} />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">System Monitor</h1>
          </div>
          <p className="text-slate-600 text-lg ml-14">
            Real-time monitoring dashboard for all system components and services
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Total Monitors</span>
              <Activity size={20} className="text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{stats.totalMonitors}</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Active</span>
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.activeCount}</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Warnings</span>
              <AlertTriangle size={20} className="text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.warningCount}</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Critical</span>
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.criticalCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">Average Uptime</h3>
              <p className="text-sm text-slate-600">Across all monitored services</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-800">
                {stats.avgUptime.toFixed(2)}%
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp size={16} />
                <span>Healthy</span>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.avgUptime}%` }}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-blue-600"></div>
            <p className="mt-4 text-slate-600">Loading monitors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monitors.map((monitor) => {
              const config = STATUS_CONFIG[monitor.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={monitor.id}
                  className={`bg-white rounded-xl shadow-md border-2 ${config.borderColor} hover:shadow-xl transition-all overflow-hidden`}
                >
                  <div className={`h-2 ${config.color}`}></div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                          {monitor.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {monitor.description}
                        </p>
                      </div>
                      <div className={`p-2 ${config.bgLight} rounded-lg ml-3`}>
                        <StatusIcon size={24} className={config.textColor} />
                      </div>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-3 py-1 ${config.bgLight} ${config.textColor} rounded-full text-sm font-semibold mb-4`}>
                      <div className={`w-2 h-2 ${config.color} rounded-full animate-pulse`}></div>
                      {config.label}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 flex items-center gap-1">
                          <TrendingUp size={14} />
                          Uptime
                        </span>
                        <span className="font-semibold text-slate-800">
                          {Number(monitor.uptime_percentage).toFixed(2)}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`${
                            monitor.uptime_percentage >= 99
                              ? 'bg-green-500'
                              : monitor.uptime_percentage >= 95
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          } h-2 rounded-full transition-all`}
                          style={{ width: `${monitor.uptime_percentage}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 flex items-center gap-1">
                          <Activity size={14} />
                          Response Time
                        </span>
                        <span className={`font-semibold ${getResponseTimeColor(monitor.response_time)}`}>
                          {monitor.response_time}ms
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm pt-2">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock size={14} />
                          Last Updated
                        </span>
                        <span className="text-slate-700 font-medium">
                          {formatTime(monitor.last_updated)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && monitors.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-200">
            <Activity size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Monitors Found</h3>
            <p className="text-slate-600">
              Add monitoring components through the admin panel to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
