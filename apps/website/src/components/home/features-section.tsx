import { 
  MagnifyingGlassIcon, 
  DocumentArrowDownIcon, 
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Advanced Search',
    description: 'Full-text search across all writings with intelligent suggestions and filters. Find exactly what you\'re looking for in seconds.',
    icon: MagnifyingGlassIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'PDF Generation',
    description: 'Create custom PDFs with configurable formatting, pagination, and copyright-compliant layouts for study and sharing.',
    icon: DocumentArrowDownIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    name: 'Research Compilation',
    description: 'Automatically compile research on any topic by searching multiple sources and generating comprehensive study materials.',
    icon: AcademicCapIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'Complete Library',
    description: 'Access the full collection of Ellen G. White writings, books, and periodical articles in digital format.',
    icon: BookOpenIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    name: 'Fast Performance',
    description: 'Lightning-fast search and navigation powered by optimized databases and modern web technologies.',
    icon: ClockIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    name: 'Multi-language',
    description: 'Browse writings in multiple languages with support for over 100 language translations.',
    icon: GlobeAltIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
];

export function FeaturesSection() {
  return (
    <div className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
            Powerful Research Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to study, research, and explore Ellen G. White writings 
            with modern digital tools designed for scholars, pastors, and students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="relative p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className={`inline-flex items-center justify-center p-3 ${feature.bgColor} rounded-lg mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-serif font-bold mb-4">
              Ready to Start Your Research?
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Join thousands of researchers, pastors, and students who use our platform 
              for in-depth study of Ellen G. White writings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/search"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                Start Searching
              </a>
              <a
                href="/books"
                className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white font-medium rounded-lg transition-colors"
              >
                Browse Library
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}