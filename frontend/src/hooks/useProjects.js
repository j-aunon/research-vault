import { useLibrary } from '../contexts/LibraryContext';

export const useProjects = () => {
  const { projects, selectedProject, selectProject, createProject, deleteProject, loadingProjects } = useLibrary();
  return { projects, selectedProject, selectProject, createProject, deleteProject, loadingProjects };
};
