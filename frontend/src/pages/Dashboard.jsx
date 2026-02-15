import { useMemo, useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import QuickFilters from '../components/filters/QuickFilters';
import ResourceList from '../components/resources/ResourceList';
import EmptyState from '../components/common/EmptyState';
import AddResourceModal from '../components/resources/AddResourceModal';
import AddProjectModal from '../components/projects/AddProjectModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useLibrary } from '../contexts/LibraryContext';
import { useAuth } from '../hooks/useAuth';
import { resourcesService } from '../services/resources.service';

function AddFolderModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('bg-purple-500');

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onCreate({ name, color });
          setName('');
          setColor('bg-purple-500');
          onClose();
        }}
        className="bg-gray-900 border border-purple-500/50 rounded-2xl max-w-md w-full p-6"
      >
        <h2 className="text-lg font-semibold text-purple-300 mb-4">Add Folder</h2>
        <input className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg mb-4" placeholder="Folder name" value={name} onChange={(e) => setName(e.target.value)} required />
        <select className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg mb-4" value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="bg-purple-500">Purple</option>
          <option value="bg-blue-500">Blue</option>
          <option value="bg-cyan-500">Cyan</option>
          <option value="bg-green-500">Green</option>
        </select>
        <div className="flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg">Create</button>
          <button type="button" onClick={onClose} className="px-4 border border-purple-500/30 rounded-lg">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Dashboard() {
  const { logout } = useAuth();
  const {
    projects,
    resources,
    selectedProject,
    selectedFolder,
    selectedType,
    searchQuery,
    starredOnly,
    sortBy,
    loadingResources,
    error,
    setSelectedType,
    setSearchQuery,
    setStarredOnly,
    setSortBy,
    selectProject,
    selectFolder,
    createProject,
    createFolder,
    createResource,
    deleteFolder,
    deleteProject,
    toggleStar,
    clickTagSearch
  } = useLibrary();

  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [folderProjectId, setFolderProjectId] = useState('');

  const selectedProjectResources = useMemo(() => {
    if (!selectedProject) return [];
    return resources;
  }, [resources, selectedProject]);

  const openResourceFile = async (resourceId) => {
    try {
      const response = await resourcesService.downloadFile(resourceId);
      const blobUrl = window.URL.createObjectURL(response.data);
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
    } catch {
      // Keep minimal UX: resource card remains usable even if file is missing.
      alert('Could not open attached PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header onAddResource={() => setShowResourceModal(true)} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          <Sidebar
            projects={projects}
            resources={selectedProjectResources}
            selectedProject={selectedProject}
            selectedFolder={selectedFolder}
            selectedType={selectedType}
            searchQuery={searchQuery}
            onAddProject={() => setShowProjectModal(true)}
            onSelectProject={selectProject}
            onSelectFolder={selectFolder}
            onSelectType={setSelectedType}
            onSearchChange={setSearchQuery}
            onAddFolder={(projectId) => setFolderProjectId(projectId)}
            onDeleteFolder={deleteFolder}
            onDeleteProject={deleteProject}
          />

          <main className="col-span-12 lg:col-span-9">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-gray-100">
                  {selectedProject ? `${resources.length} Resource${resources.length === 1 ? '' : 's'}` : 'Select a project'}
                </h2>

                <div className="flex gap-2 items-center">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 text-sm bg-black/60 border border-cyan-500/30 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="recent">Recently Added</option>
                    <option value="title">Title A-Z</option>
                    <option value="starred">Starred First</option>
                  </select>
                </div>
              </div>

              <QuickFilters
                resources={resources}
                starredOnly={starredOnly}
                onToggleStarred={() => setStarredOnly((p) => !p)}
                onTypePick={setSelectedType}
              />
            </div>

            {error ? <p className="text-red-400 text-sm mb-4">{error}</p> : null}

            {loadingResources ? (
              <LoadingSpinner />
            ) : selectedProject && resources.length ? (
              <ResourceList
                resources={resources}
                projects={projects}
                onToggleStar={toggleStar}
                onTagClick={clickTagSearch}
                onOpenFile={openResourceFile}
              />
            ) : (
              <EmptyState hasProject={Boolean(selectedProject)} />
            )}
          </main>
        </div>
      </div>

      <AddResourceModal
        open={showResourceModal}
        onClose={() => setShowResourceModal(false)}
        projects={projects}
        selectedProject={selectedProject}
        onCreate={createResource}
      />

      <AddProjectModal open={showProjectModal} onClose={() => setShowProjectModal(false)} onCreate={createProject} />

      <AddFolderModal
        open={Boolean(folderProjectId)}
        onClose={() => setFolderProjectId('')}
        onCreate={(payload) => createFolder(folderProjectId, payload)}
      />
    </div>
  );
}
