import { Item } from '@/backend';
import ItemCard from './ItemCard';
import EmptyState from './EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

interface ItemListProps {
  items: Item[];
  isLoading?: boolean;
  showCategory?: boolean;
}

export default function ItemList({ items, isLoading, showCategory }: ItemListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} showCategory={showCategory} />
      ))}
    </div>
  );
}
