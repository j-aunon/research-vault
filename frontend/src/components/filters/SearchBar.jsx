import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl shadow-lg shadow-purple-500/10 p-4 mb-6 border border-purple-500/30">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search resources..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-900/80 border border-purple-500/30 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
