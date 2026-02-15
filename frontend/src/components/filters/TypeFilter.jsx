import { BookOpen, FileText, Globe, Tag } from 'lucide-react';

function typeIcon(type) {
  if (type === 'paper') return <FileText className="w-4 h-4" />;
  if (type === 'book') return <BookOpen className="w-4 h-4" />;
  if (type === 'website') return <Globe className="w-4 h-4" />;
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

export default function TypeFilter({ selectedType, onSelectType, selectedProject, resources }) {
  const countFor = (type) => {
    if (type === 'all') return resources.length;
    return resources.filter((i) => i.type === type).length;
  };

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl shadow-lg shadow-green-500/10 p-4 border border-green-500/30">
      <h2 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
        <Tag className="w-4 h-4 text-green-400" />
        Content Type
      </h2>

      <div className="space-y-1">
        {['all', 'paper', 'book', 'website'].map((type) => (
          <button
            key={type}
            onClick={() => onSelectType(type)}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
              selectedType === type
                ? 'bg-cyan-500/20 text-cyan-400 font-medium border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                : 'text-gray-300 hover:bg-gray-800/50 border border-transparent hover:border-green-500/20'
            }`}
          >
            {typeIcon(type)}
            <span className="text-sm capitalize">{type === 'all' ? 'All Content' : `${type}s`}</span>
            <span className="ml-auto text-xs text-gray-500">{selectedProject ? countFor(type) : 0}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
