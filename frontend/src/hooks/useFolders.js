import { useLibrary } from '../contexts/LibraryContext';

export const useFolders = () => {
  const { selectedFolder, selectFolder, createFolder, deleteFolder } = useLibrary();
  return { selectedFolder, selectFolder, createFolder, deleteFolder };
};
