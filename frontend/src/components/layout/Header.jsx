import { BookOpen, LogOut, Plus } from 'lucide-react';

export default function Header({ onAddResource, onLogout }) {
  return (
    <header className="bg-black/80 border-b border-blue-500/30 shadow-xl shadow-blue-500/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg shadow-blue-500/50">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">Research Library</h1>
              <p className="text-gray-400 text-sm">Your personal knowledge vault</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="px-4 py-3 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-500/10 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button
              onClick={onAddResource}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Resource
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
