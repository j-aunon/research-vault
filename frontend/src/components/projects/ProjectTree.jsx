import { Folder, Plus, Trash2 } from 'lucide-react';

export default function ProjectTree({
  projects,
  resources,
  selectedProject,
  selectedFolder,
  onAddProject,
  onSelectProject,
  onSelectFolder,
  onAddFolder,
  onDeleteFolder,
  onDeleteProject
}) {
  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl shadow-lg shadow-cyan-500/10 p-4 mb-6 border border-cyan-500/30">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Folder className="w-4 h-4 text-cyan-400" />
          Projects
        </h2>
        <button
          onClick={onAddProject}
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
          title="Add Project"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {projects.map((project) => (
          <div key={project.id} className="space-y-1">
            <div className="flex gap-2">
              <button
                onClick={() => onSelectProject(project.id)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  selectedProject === project.id
                    ? 'bg-blue-500/20 text-blue-400 font-medium border border-blue-500/50 shadow-lg shadow-blue-500/20'
                    : 'text-gray-300 hover:bg-gray-800/50 border border-transparent hover:border-purple-500/20'
                }`}
              >
                <svg className={`w-3 h-3 transition-transform ${selectedProject === project.id ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div className={`w-3 h-3 rounded-full ${project.color} shadow-lg`} />
                <span className="text-sm flex-1">{project.name}</span>
                <span className="text-xs text-gray-500">{project._count?.resources ?? resources.filter((r) => r.projectId === project.id).length}</span>
              </button>
              <button onClick={() => onDeleteProject(project.id)} className="px-2 text-gray-500 hover:text-red-400" title="Delete project">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {selectedProject === project.id && (project.folders || []).length > 0 ? (
              <div className="ml-4 pl-3 border-l-2 border-gray-700/50 space-y-1">
                {project.folders.map((folder) => (
                  <div key={folder.id} className="flex gap-2">
                    <button
                      onClick={() => onSelectFolder(folder.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all text-sm ${
                        selectedFolder === folder.id
                          ? 'bg-purple-500/20 text-purple-400 font-medium border border-purple-500/50 shadow-lg shadow-purple-500/20'
                          : 'text-gray-400 hover:bg-gray-800/50 border border-transparent hover:border-purple-500/20'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${folder.color}`} />
                      <span className="flex-1">{folder.name}</span>
                      <span className="text-xs text-gray-500">{folder._count?.resources ?? resources.filter((r) => r.folderId === folder.id).length}</span>
                    </button>
                    <button onClick={() => onDeleteFolder(folder.id)} className="px-1 text-gray-500 hover:text-red-400" title="Delete folder">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {selectedProject === project.id ? (
              <div className="ml-4 pl-3 border-l-2 border-gray-700/50">
                <button
                  onClick={() => onAddFolder(project.id)}
                  className="w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all text-sm text-gray-500 hover:text-purple-400 hover:bg-gray-800/50 border border-transparent hover:border-purple-500/20"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Folder</span>
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
