import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Item, Category } from '@/backend';

export function useCollectionData() {
  const { actor, isFetching: isActorFetching } = useActor();

  const allItemsQuery = useQuery<Item[]>({
    queryKey: ['items', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listItems();
    },
    enabled: !!actor && !isActorFetching,
  });

  const booksQuery = useQuery<Item[]>({
    queryKey: ['items', 'books'],
    queryFn: async () => {
      if (!actor) return [];
      const category: Category = { __kind__: 'Book', Book: { name: '', year: BigInt(0) } };
      return actor.filterByCategory(category);
    },
    enabled: !!actor && !isActorFetching,
  });

  const patchesQuery = useQuery<Item[]>({
    queryKey: ['items', 'patches'],
    queryFn: async () => {
      if (!actor) return [];
      const category: Category = { __kind__: 'Patch', Patch: null };
      return actor.filterByCategory(category);
    },
    enabled: !!actor && !isActorFetching,
  });

  const uniformsQuery = useQuery<Item[]>({
    queryKey: ['items', 'uniforms'],
    queryFn: async () => {
      if (!actor) return [];
      const category: Category = { __kind__: 'Uniform', Uniform: null };
      return actor.filterByCategory(category);
    },
    enabled: !!actor && !isActorFetching,
  });

  const tinsQuery = useQuery<Item[]>({
    queryKey: ['items', 'tins'],
    queryFn: async () => {
      if (!actor) return [];
      const category: Category = { __kind__: 'Tin', Tin: null };
      return actor.filterByCategory(category);
    },
    enabled: !!actor && !isActorFetching,
  });

  const booksSortedByYearQuery = useQuery<Item[]>({
    queryKey: ['items', 'books-sorted'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.sortBooksByYear();
    },
    enabled: !!actor && !isActorFetching,
  });

  return {
    allItems: allItemsQuery.data,
    books: booksQuery.data,
    patches: patchesQuery.data,
    uniforms: uniformsQuery.data,
    tins: tinsQuery.data,
    booksSortedByYear: booksSortedByYearQuery.data,
    isLoading: allItemsQuery.isLoading || booksQuery.isLoading || patchesQuery.isLoading || uniformsQuery.isLoading || tinsQuery.isLoading,
    isError: allItemsQuery.isError || booksQuery.isError || patchesQuery.isError || uniformsQuery.isError || tinsQuery.isError,
  };
}
