import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Category } from '@/backend';
import { ExternalBlob } from '@/backend';
import { toast } from 'sonner';

interface AddItemParams {
  id: string;
  category: Category;
  photo: ExternalBlob | null;
}

export function useAddItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, category, photo }: AddItemParams) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addItem(id, category, photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item added successfully!');
    },
    onError: (error) => {
      console.error('Failed to add item:', error);
      toast.error('Failed to add item. Please try again.');
    },
  });
}
