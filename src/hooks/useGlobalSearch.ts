import { useState, useEffect, useCallback } from 'react';
import { Task, UserList } from '@/types';

export interface SearchResult {
  tasks: (Task & { listName: string })[];
  lists: UserList[];
}

interface UseGlobalSearchReturn {
  searchResults: SearchResult;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

export const useGlobalSearch = (query: string, debounceMs: number = 300): UseGlobalSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchResult>({ tasks: [], lists: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Perform search when debounced query changes
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults({ tasks: [], lists: [] });
      setIsLoading(false);
      setError(null);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const result: SearchResult = await response.json();
      setSearchResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tìm kiếm');
      setSearchResults({ tasks: [], lists: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  return {
    searchResults,
    isLoading,
    error,
    hasSearched
  };
};