export default function QuickFilters({ resources, starredOnly, onToggleStarred, onTypePick }) {
  const papers = resources.filter((r) => r.type === 'paper').length;
  const books = resources.filter((r) => r.type === 'book').length;
  const websites = resources.filter((r) => r.type === 'website').length;
  const starred = resources.filter((r) => r.starred).length;

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={onToggleStarred}
        className={`px-3 py-1.5 text-xs text-gray-300 rounded-lg transition-all border border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20 ${
          starredOnly ? 'bg-yellow-500/20 text-yellow-400' : 'bg-black/60 hover:bg-yellow-500/20 hover:text-yellow-400'
        }`}
      >
        ⭐ Starred ({starred})
      </button>
      <button onClick={() => onTypePick('paper')} className="px-3 py-1.5 text-xs bg-black/60 hover:bg-pink-500/20 hover:text-pink-400 text-gray-300 rounded-lg transition-all border border-pink-500/30 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/20">
        📚 All Papers ({papers})
      </button>
      <button onClick={() => onTypePick('book')} className="px-3 py-1.5 text-xs bg-black/60 hover:bg-cyan-500/20 hover:text-cyan-400 text-gray-300 rounded-lg transition-all border border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
        📖 All Books ({books})
      </button>
      <button onClick={() => onTypePick('website')} className="px-3 py-1.5 text-xs bg-black/60 hover:bg-green-500/20 hover:text-green-400 text-gray-300 rounded-lg transition-all border border-green-500/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20">
        🌐 All Websites ({websites})
      </button>
    </div>
  );
}
