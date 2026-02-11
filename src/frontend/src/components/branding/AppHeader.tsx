import { BookOpen } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center gap-4">
          <img
            src="/assets/generated/gs-collection-logo.dim_512x512.png"
            alt="Girl Scout Collection"
            className="h-16 w-16 rounded-lg"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-primary" />
              Madelyn's Girl Scout Collection
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Preserving memories, one treasure at a time
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
