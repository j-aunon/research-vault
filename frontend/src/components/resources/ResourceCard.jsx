import { BookOpen, Calendar, FileText, Folder, Globe, Star, Tag } from 'lucide-react';

const typeColor = {
  paper: 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-lg shadow-blue-500/30',
  book: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-500/30',
  website: 'bg-green-500/20 text-green-400 border-green-500/50 shadow-lg shadow-green-500/30'
};

function typeIcon(type) {
  if (type === 'paper') return <FileText className="w-5 h-5" />;
  if (type === 'book') return <BookOpen className="w-5 h-5" />;
  return <Globe className="w-5 h-5" />;
}

function normalizeUrl(url) {
  if (!url) return '';
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
}

export default function ResourceCard({ item, onToggleStar, onTagClick, onOpenFile, projectName }) {
  const href = normalizeUrl(item.url);
  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all p-6 border border-gray-800 hover:border-blue-500/50 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-4 flex-1">
          <div className={`p-3 rounded-lg border ${typeColor[item.type]}`}>{typeIcon(item.type)}</div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                {item.title}
              </h3>
              <button onClick={() => onToggleStar(item.id)} className="text-gray-600 hover:text-yellow-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
                <Star className={`w-5 h-5 ${item.starred ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : ''}`} />
              </button>
            </div>

            {item.url ? (
              <a href={href} target="_blank" rel="noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 mb-2 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]">
                {item.url}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : null}

            <p className="text-sm text-gray-300 mb-3">{item.notes || 'No notes added.'}</p>
            {item.fileName ? (
              <button
                onClick={() => onOpenFile(item.id, item.fileName)}
                className="mb-3 px-3 py-1.5 text-xs bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-lg hover:bg-blue-500/30"
              >
                Open PDF: {item.fileName}
              </button>
            ) : null}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(item.addedDate || item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Folder className="w-3 h-3" />
                {projectName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <Tag className="w-3 h-3 text-gray-500" />
        {(item.tags || []).map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagClick(tag.name)}
            className="px-2 py-1 bg-gray-900/80 text-gray-300 rounded-md text-xs font-medium hover:bg-purple-500/20 hover:text-purple-400 hover:border-purple-500/50 transition-all cursor-pointer border border-gray-700 hover:shadow-lg hover:shadow-purple-500/20"
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
