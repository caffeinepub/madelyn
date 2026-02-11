import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ExternalBlob } from '@/backend';

interface PhotoPickerProps {
  onPhotoSelect: (photo: ExternalBlob | null) => void;
}

export default function PhotoPicker({ onPhotoSelect }: PhotoPickerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Convert to bytes for backend
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(bytes);
    onPhotoSelect(blob);
  };

  const handleRemove = () => {
    setPreview(null);
    onPhotoSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border bg-muted">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-48 border-dashed"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium">Click to upload</span>
              <p className="text-muted-foreground">or drag and drop</p>
            </div>
          </div>
        </Button>
      )}
    </div>
  );
}
