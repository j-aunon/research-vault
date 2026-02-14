import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { foldersService } from '../services/folders.service';
import { projectsService } from '../services/projects.service';
import { resourcesService } from '../services/resources.service';
import { tagsService } from '../services/tags.service';

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [tags, setTags] = useState([]);

  const [selectedProject, setSelectedProject] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [starredOnly, setStarredOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');

  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    setError('');
    try {
      const { data } = await projectsService.list();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const fetchResources = useCallback(async () => {
    if (!selectedProject) {
      setResources([]);
      return;
    }

    setLoadingResources(true);
    setError('');

    try {
      const { data } = await resourcesService.list({
        projectId: selectedProject,
        folderId: selectedFolder || undefined,
        type: selectedType === 'all' ? undefined : selectedType,
        starred: starredOnly ? true : undefined,
        search: searchQuery || undefined,
        sortBy
      });
      setResources(data.resources || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load resources');
    } finally {
      setLoadingResources(false);
    }
  }, [selectedProject, selectedFolder, selectedType, starredOnly, searchQuery, sortBy]);

  const fetchTags = useCallback(async () => {
    try {
      const { data } = await tagsService.list();
      setTags(data.tags || []);
    } catch {
      setTags([]);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchTags();
  }, [fetchProjects, fetchTags]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const selectProject = (projectId) => {
    if (selectedProject === projectId) {
      setSelectedProject('');
      setSelectedFolder('');
      return;
    }
    setSelectedProject(projectId);
    setSelectedFolder('');
  };

  const selectFolder = (folderId) => {
    setSelectedFolder(folderId);
  };

  const createProject = async (payload) => {
    const { data } = await projectsService.create(payload);
    setProjects((prev) => [data.project, ...prev]);
    return data.project;
  };

  const createFolder = async (projectId, payload) => {
    const { data } = await foldersService.create(projectId, payload);
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, folders: [...(project.folders || []), data.folder] }
          : project
      )
    );
    return data.folder;
  };

  const createResource = async (payload) => {
    const { file, ...resourcePayload } = payload;
    const { data } = await resourcesService.create(resourcePayload);
    if (file && data.resource?.id) {
      await resourcesService.uploadFile(data.resource.id, file);
    }
    await Promise.all([fetchResources(), fetchProjects(), fetchTags()]);
    return data.resource;
  };

  const deleteFolder = async (folderId) => {
    await foldersService.remove(folderId);
    if (selectedFolder === folderId) {
      setSelectedFolder('');
    }
    await Promise.all([fetchProjects(), fetchResources()]);
  };

  const deleteProject = async (projectId) => {
    await projectsService.remove(projectId);
    if (selectedProject === projectId) {
      setSelectedProject('');
      setSelectedFolder('');
    }
    await Promise.all([fetchProjects(), fetchResources()]);
  };

  const toggleStar = async (id) => {
    await resourcesService.toggleStar(id);
    await fetchResources();
  };

  const clickTagSearch = (tagName) => {
    setSearchQuery(tagName);
  };

  const value = useMemo(
    () => ({
      projects,
      resources,
      tags,
      selectedProject,
      selectedFolder,
      selectedType,
      searchQuery,
      starredOnly,
      sortBy,
      viewMode,
      loadingProjects,
      loadingResources,
      error,
      setSelectedType,
      setSearchQuery,
      setStarredOnly,
      setSortBy,
      setViewMode,
      selectProject,
      selectFolder,
      createProject,
      createFolder,
      createResource,
      deleteFolder,
      deleteProject,
      toggleStar,
      clickTagSearch,
      refetchProjects: fetchProjects,
      refetchResources: fetchResources
    }),
    [
      projects,
      resources,
      tags,
      selectedProject,
      selectedFolder,
      selectedType,
      searchQuery,
      starredOnly,
      sortBy,
      viewMode,
      loadingProjects,
      loadingResources,
      error,
      fetchProjects,
      fetchResources
    ]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error('useLibrary must be used inside LibraryProvider');
  }
  return ctx;
}
