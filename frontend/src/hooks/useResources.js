import { useLibrary } from '../contexts/LibraryContext';

export const useResources = () => {
  const {
    resources,
    selectedType,
    searchQuery,
    sortBy,
    starredOnly,
    setSelectedType,
    setSearchQuery,
    setSortBy,
    setStarredOnly,
    createResource,
    toggleStar,
    loadingResources
  } = useLibrary();

  return {
    resources,
    selectedType,
    searchQuery,
    sortBy,
    starredOnly,
    setSelectedType,
    setSearchQuery,
    setSortBy,
    setStarredOnly,
    createResource,
    toggleStar,
    loadingResources
  };
};
