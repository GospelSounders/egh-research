export function StatsSection() {
  const stats = [
    { name: 'Books & Writings', value: '120+', description: 'Complete works available' },
    { name: 'Searchable Pages', value: '25,000+', description: 'Fully indexed content' },
    { name: 'Languages', value: '100+', description: 'Translation support' },
    { name: 'Research Topics', value: '1,000+', description: 'Categorized subjects' },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Comprehensive Digital Library
          </h2>
          <p className="text-lg text-gray-600">
            Access one of the most complete digital collections of Ellen G. White writings
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.name} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {stat.name}
              </div>
              <div className="text-sm text-gray-600">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}