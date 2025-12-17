import { useState } from 'react';
import PCBuilder from './components/PCBuilder';
import AdminPanel from './components/AdminPanel';
import { Settings, Home } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<'builder' | 'admin'>('builder');

  return (
    <div className="min-h-screen">
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">PC</span>
              </div>
              <span className="text-white text-xl font-bold">PC Builder</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage('builder')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === 'builder'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Home size={18} />
                <span className="hidden sm:inline">Beranda</span>
              </button>
              <button
                onClick={() => setCurrentPage('admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === 'admin'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Settings size={18} />
                <span className="hidden sm:inline">Admin Panel</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {currentPage === 'builder' ? <PCBuilder /> : <AdminPanel />}
    </div>
  );
}

export default App;
