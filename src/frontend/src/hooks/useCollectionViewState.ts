import { useState, useMemo } from 'react';
import type { Item } from '@/backend';

export function useCollectionViewState() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const getFilteredItems = useMemo(() => {
    return (items: Item[], category: string, sort: string) => {
      let filtered = [...items];

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((item) => {
          if (item.category.__kind__ === 'Book') {
            return item.category.Book.name.toLowerCase().includes(query);
          }
          return item.id.toLowerCase().includes(query);
        });
      }

      // Apply sorting
      filtered.sort((a, b) => {
        if (sort === 'newest') {
          return Number(b.timestamp - a.timestamp);
        }
        if (sort === 'oldest') {
          return Number(a.timestamp - b.timestamp);
        }
        if (sort === 'year-asc' || sort === 'year-desc') {
          if (a.category.__kind__ === 'Book' && b.category.__kind__ === 'Book') {
            const yearDiff = Number(a.category.Book.year - b.category.Book.year);
            if (yearDiff !== 0) {
              return sort === 'year-asc' ? yearDiff : -yearDiff;
            }
            return a.category.Book.name.localeCompare(b.category.Book.name);
          }
          return 0;
        }
        return 0;
      });

      return filtered;
    };
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    getFilteredItems,
  };
}
