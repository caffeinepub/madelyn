import { Item } from '@/backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface ItemDetailsDialogProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ItemDetailsDialog({ item, open, onOpenChange }: ItemDetailsDialogProps) {
  const [imageError, setImageError] = useState(false);

  const getCategoryInfo = () => {
    if (item.category.__kind__ === 'Book') {
      return {
        label: 'Book',
        color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        title: item.category.Book.name,
        details: [
          { label: 'Year', value: item.category.Book.year.toString() },
        ],
      };
    }
    if (item.category.__kind__ === 'Patch') {
      return {
        label: 'Patch',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
        title: item.id,
        details: [],
      };
    }
    if (item.category.__kind__ === 'Uniform') {
      return {
        label: 'Uniform',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        title: item.id,
        details: [],
      };
    }
    return {
      label: 'Tin',
      color: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
      title: item.id,
      details: [],
    };
  };

  const categoryInfo = getCategoryInfo();
  const imageUrl = item.photo?.getDirectURL();
  const date = new Date(Number(item.timestamp) / 1000000);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl">{categoryInfo.title}</DialogTitle>
            <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {imageUrl && !imageError ? (
            <div className="rounded-lg overflow-hidden bg-muted">
              <img
                src={imageUrl}
                alt={categoryInfo.title}
                className="w-full h-auto max-h-96 object-contain"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="rounded-lg bg-muted aspect-video flex items-center justify-center">
              <ImageIcon className="h-24 w-24 text-muted-foreground/30" />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Added on {date.toLocaleDateString()} at {date.toLocaleTimeString()}
            </div>

            {categoryInfo.details.length > 0 && (
              <div className="space-y-2">
                {categoryInfo.details.map((detail) => (
                  <div key={detail.label} className="flex items-center justify-between py-2 border-b">
                    <span className="font-medium">{detail.label}</span>
                    <span className="text-muted-foreground">{detail.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                <strong>Item ID:</strong> {item.id}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
