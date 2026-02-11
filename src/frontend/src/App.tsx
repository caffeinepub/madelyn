import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import AppHeader from './components/branding/AppHeader';
import ItemList from './components/collection/ItemList';
import ItemFormDialog from './components/collection/ItemFormDialog';
import CollectionToolbar from './components/collection/CollectionToolbar';
import { useCollectionData } from './hooks/useCollectionQueries';
import { useCollectionViewState } from './hooks/useCollectionViewState';
import type { Category } from './backend';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'books' | 'patches' | 'uniforms' | 'tins'>('all');
  
  const { allItems, books, patches, uniforms, tins, isLoading } = useCollectionData();
  const { searchQuery, setSearchQuery, sortBy, setSortBy, getFilteredItems } = useCollectionViewState();

  const handleAddClick = () => {
    setIsFormOpen(true);
  };

  const getCategoryForForm = (): Category | undefined => {
    if (selectedCategory === 'books') {
      return { __kind__: 'Book', Book: { name: '', year: BigInt(new Date().getFullYear()) } };
    }
    if (selectedCategory === 'patches') {
      return { __kind__: 'Patch', Patch: null };
    }
    if (selectedCategory === 'uniforms') {
      return { __kind__: 'Uniform', Uniform: null };
    }
    if (selectedCategory === 'tins') {
      return { __kind__: 'Tin', Tin: null };
    }
    return undefined;
  };

  const getItemsForTab = () => {
    let items;
    switch (selectedCategory) {
      case 'books':
        items = books;
        break;
      case 'patches':
        items = patches;
        break;
      case 'uniforms':
        items = uniforms;
        break;
      case 'tins':
        items = tins;
        break;
      default:
        items = allItems;
    }
    return getFilteredItems(items || [], selectedCategory, sortBy);
  };

  const filteredItems = getItemsForTab();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">My Collection</h2>
          <p className="text-muted-foreground">
            Track your Girl Scout books, patches, uniforms, and tins
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1 sm:flex-none">
                All Items
              </TabsTrigger>
              <TabsTrigger value="books" className="flex-1 sm:flex-none">
                Books
              </TabsTrigger>
              <TabsTrigger value="patches" className="flex-1 sm:flex-none">
                Patches
              </TabsTrigger>
              <TabsTrigger value="uniforms" className="flex-1 sm:flex-none">
                Uniforms
              </TabsTrigger>
              <TabsTrigger value="tins" className="flex-1 sm:flex-none">
                Tins
              </TabsTrigger>
            </TabsList>

            <Button onClick={handleAddClick} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <CollectionToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showBookSort={selectedCategory === 'books' || selectedCategory === 'all'}
          />

          <TabsContent value="all" className="mt-6">
            <ItemList items={filteredItems} isLoading={isLoading} showCategory />
          </TabsContent>

          <TabsContent value="books" className="mt-6">
            <ItemList items={filteredItems} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="patches" className="mt-6">
            <ItemList items={filteredItems} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="uniforms" className="mt-6">
            <ItemList items={filteredItems} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="tins" className="mt-6">
            <ItemList items={filteredItems} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <ItemFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        defaultCategory={getCategoryForForm()}
      />

      <Toaster />
    </div>
  );
}

export default App;
