import { useState, useCallback } from 'react';
import { MediaFile } from '../../types/phase6.types';

interface FilterOptions {
  type?: 'image' | 'document' | 'audio' | 'video' | 'all';
  sortBy?: 'date' | 'name' | 'size';
  searchTerm?: string;
}

export const useMediaGallery = (initialFiles: MediaFile[] = []) => {
  const [files, setFiles] = useState<MediaFile[]>(initialFiles);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterOptions>({
    type: 'all',
    sortBy: 'date',
    searchTerm: '',
  });

  const filteredAndSortedFiles = useCallback((): MediaFile[] => {
    let result = [...files];

    // Filter by type
    if (filter.type && filter.type !== 'all') {
      result = result.filter((f) => f.type === filter.type);
    }

    // Filter by search term
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      result = result.filter((f) =>
        f.name.toLowerCase().includes(term)
      );
    }

    // Sort
    switch (filter.sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'size':
        result.sort((a, b) => b.size - a.size);
        break;
      case 'date':
      default:
        result.sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
    }

    return result;
  }, [files, filter]);

  const addFile = useCallback((file: MediaFile) => {
    setFiles((prev) => [file, ...prev]);
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      next.delete(fileId);
      return next;
    });
  }, []);

  const toggleFileSelection = useCallback((fileId: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  }, []);

  const selectAllVisibleFiles = useCallback(() => {
    const visible = filteredAndSortedFiles();
    const allIds = new Set(visible.map((f) => f.id));
    setSelectedFiles(allIds);
  }, [filteredAndSortedFiles]);

  const clearSelection = useCallback(() => {
    setSelectedFiles(new Set());
  }, []);

  const deleteSelectedFiles = useCallback(() => {
    setFiles((prev) =>
      prev.filter((f) => !selectedFiles.has(f.id))
    );
    setSelectedFiles(new Set());
  }, [selectedFiles]);

  const updateFilter = useCallback((updates: Partial<FilterOptions>) => {
    setFilter((prev) => ({ ...prev, ...updates }));
  }, []);

  const getTotalSize = useCallback((): number => {
    return filteredAndSortedFiles().reduce((sum, f) => sum + f.size, 0);
  }, [filteredAndSortedFiles]);

  const getFileCountByType = useCallback((): Record<string, number> => {
    const counts: Record<string, number> = {
      image: 0,
      document: 0,
      audio: 0,
      video: 0,
      other: 0,
    };

    files.forEach((f) => {
      counts[f.type]++;
    });

    return counts;
  }, [files]);

  return {
    files: filteredAndSortedFiles(),
    allFiles: files,
    selectedFiles,
    filter,
    addFile,
    removeFile,
    toggleFileSelection,
    selectAllVisibleFiles,
    clearSelection,
    deleteSelectedFiles,
    updateFilter,
    getTotalSize,
    getFileCountByType,
  };
};

export default useMediaGallery;
