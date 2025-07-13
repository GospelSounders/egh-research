export function RecentlyAddedSection() {
  return (
    <div className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Recently Added Content
          </h2>
          <p className="text-lg text-gray-600">
            Latest additions to our growing digital library
          </p>
        </div>
        
        <div className="text-center text-gray-500">
          <p>Content will be loaded dynamically from the database</p>
        </div>
      </div>
    </div>
  );
}