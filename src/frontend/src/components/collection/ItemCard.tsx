import { Item } from '@/backend';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import ItemDetailsDialog from './ItemDetailsDialog';

interface ItemCardProps {
  item: Item;
  showCategory?: boolean;
}

export default function ItemCard({ item, showCategory }: ItemCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getCategoryInfo = () => {
    if (item.category.__kind__ === 'Book') {
      return {
        label: 'Book',
        color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        title: item.category.Book.name,
        subtitle: `Year: ${item.category.Book.year}`,
      };
    }
    if (item.category.__kind__ === 'Patch') {
      return {
        label: 'Patch',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
        title: item.id,
        subtitle: 'Girl Scout Patch',
      };
    }
    if (item.category.__kind__ === 'Uniform') {
      return {
        label: 'Uniform',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        title: item.id,
        subtitle: 'Girl Scout Uniform',
      };
    }
    return {
      label: 'Tin',
      color: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
      title: item.id,
      subtitle: 'Girl Scout Tin',
    };
  };

  const categoryInfo = getCategoryInfo();
  const imageUrl = item.photo?.getDirectURL();
  const date = new Date(Number(item.timestamp) / 1000000);

  return (
    <>
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={() => setDetailsOpen(true)}
      >
        <CardHeader className="p-0">
          <div className="aspect-square bg-muted relative overflow-hidden">
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt={categoryInfo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}
            {showCategory && (
              <div className="absolute top-2 right-2">
                <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{categoryInfo.title}</h3>
          <p className="text-sm text-muted-foreground">{categoryInfo.subtitle}</p>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {date.toLocaleDateString()}
          </div>
        </CardFooter>
      </Card>

      <ItemDetailsDialog item={item} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </>
  );
}
