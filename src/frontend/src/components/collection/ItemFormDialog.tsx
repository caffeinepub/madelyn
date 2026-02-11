import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddItem } from '@/hooks/useCollectionMutations';
import PhotoPicker from './PhotoPicker';
import type { Category } from '@/backend';
import { ExternalBlob } from '@/backend';

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: Category;
}

export default function ItemFormDialog({ open, onOpenChange, defaultCategory }: ItemFormDialogProps) {
  const [categoryType, setCategoryType] = useState<'Book' | 'Patch' | 'Uniform' | 'Tin'>('Book');
  const [bookName, setBookName] = useState('');
  const [bookYear, setBookYear] = useState(new Date().getFullYear().toString());
  const [itemId, setItemId] = useState('');
  const [photo, setPhoto] = useState<ExternalBlob | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addItemMutation = useAddItem();

  useEffect(() => {
    if (defaultCategory) {
      setCategoryType(defaultCategory.__kind__ as 'Book' | 'Patch' | 'Uniform' | 'Tin');
      if (defaultCategory.__kind__ === 'Book') {
        setBookName(defaultCategory.Book.name);
        setBookYear(defaultCategory.Book.year.toString());
      }
    }
  }, [defaultCategory]);

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setCategoryType('Book');
      setBookName('');
      setBookYear(new Date().getFullYear().toString());
      setItemId('');
      setPhoto(null);
      setUploadProgress(0);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let category: Category;
    let id: string;

    if (categoryType === 'Book') {
      if (!bookName.trim()) {
        return;
      }
      category = {
        __kind__: 'Book',
        Book: {
          name: bookName.trim(),
          year: BigInt(parseInt(bookYear) || new Date().getFullYear()),
        },
      };
      id = `book-${bookName.trim().toLowerCase().replace(/\s+/g, '-')}-${bookYear}`;
    } else if (categoryType === 'Patch') {
      if (!itemId.trim()) {
        return;
      }
      category = { __kind__: 'Patch', Patch: null };
      id = itemId.trim();
    } else if (categoryType === 'Uniform') {
      if (!itemId.trim()) {
        return;
      }
      category = { __kind__: 'Uniform', Uniform: null };
      id = itemId.trim();
    } else {
      if (!itemId.trim()) {
        return;
      }
      category = { __kind__: 'Tin', Tin: null };
      id = itemId.trim();
    }

    const photoWithProgress = photo?.withUploadProgress((percentage) => {
      setUploadProgress(percentage);
    });

    await addItemMutation.mutateAsync({
      id,
      category,
      photo: photoWithProgress || null,
    });

    onOpenChange(false);
  };

  const isFormValid = () => {
    if (categoryType === 'Book') {
      return bookName.trim() !== '' && bookYear.trim() !== '';
    }
    return itemId.trim() !== '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a new item to your Girl Scout collection
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={categoryType}
                onValueChange={(v) => setCategoryType(v as 'Book' | 'Patch' | 'Uniform' | 'Tin')}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Book">Book</SelectItem>
                  <SelectItem value="Patch">Patch</SelectItem>
                  <SelectItem value="Uniform">Uniform</SelectItem>
                  <SelectItem value="Tin">Tin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {categoryType === 'Book' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bookName">Book Name *</Label>
                  <Input
                    id="bookName"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    placeholder="Enter book name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bookYear">Year *</Label>
                  <Input
                    id="bookYear"
                    type="number"
                    value={bookYear}
                    onChange={(e) => setBookYear(e.target.value)}
                    placeholder="Enter year"
                    min="1900"
                    max={new Date().getFullYear() + 10}
                    required
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="itemId">
                  {categoryType === 'Patch' ? 'Patch Name' : categoryType === 'Uniform' ? 'Uniform Name' : 'Tin Name'} *
                </Label>
                <Input
                  id="itemId"
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  placeholder={`Enter ${categoryType.toLowerCase()} name`}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Photo (optional)</Label>
              <PhotoPicker onPhotoSelect={setPhoto} />
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={addItemMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || addItemMutation.isPending}
            >
              {addItemMutation.isPending ? 'Adding...' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
