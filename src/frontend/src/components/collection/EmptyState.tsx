export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <img
        src="/assets/generated/empty-collection-illustration.dim_1200x600.png"
        alt="Empty collection"
        className="w-full max-w-md mb-8 opacity-80"
      />
      <h3 className="text-2xl font-semibold mb-2">No items yet</h3>
      <p className="text-muted-foreground text-center max-w-md">
        Start building your collection by adding your first Girl Scout item. Click the "Add Item" button to get started!
      </p>
    </div>
  );
}
