import { Metadata } from 'next';
import Link from 'next/link';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UserGroupIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'About EGW Research Platform',
  description: 'Learn about our independent research platform for Ellen G. White writings, our mission, and why we built these tools.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold font-serif mb-6">
            About EGW Research
          </h1>
          <p className="text-xl text-primary-100 leading-relaxed">
            An independent platform dedicated to advancing research and study of Ellen G. White writings 
            through modern digital tools and publishing utilities.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Mission Statement */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-6">Our Mission</h2>
          <div className="prose prose-lg text-gray-700">
            <p>
              EGW Research exists to bridge the gap between traditional Ellen G. White scholarship 
              and modern digital research methodologies. We provide researchers, pastors, students, 
              and interested readers with powerful tools to search, study, and publish from the 
              extensive corpus of Ellen G. White's writings.
            </p>
          </div>
        </section>

        {/* Why We Built This */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-8">Why This Platform Exists</h2>
          
          {/* Existing Solutions */}
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-amber-800 mb-3">Existing EGW Resources & Their Limitations</h3>
            <div className="text-amber-700 space-y-3">
              <p>
                <strong>egwwritings.org:</strong> Official website with comprehensive content but limited search capabilities, 
                no bulk downloading, and restricted customization for research compilation.
              </p>
              <p>
                <strong>Mobile & Desktop Apps:</strong> Great for reading but lack advanced research tools, 
                PDF generation, and academic citation features needed for scholarly work.
              </p>
              <p>
                <strong>ChatGPT Custom Models:</strong> AI assistance available but without direct database access, 
                limited to training data cutoffs, and cannot generate formatted research documents with proper citations.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <AcademicCapIcon className="h-8 w-8 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI-Assisted Research</h3>
              <p className="text-gray-600">
                Combines direct database access with AI automation for intelligent topic compilation, 
                cross-referencing, and automated research document generation.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <DocumentTextIcon className="h-8 w-8 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Professional Publishing</h3>
              <p className="text-gray-600">
                Generate publication-ready PDFs with proper formatting, academic citations, 
                copyright compliance, and customizable layouts for various purposes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <MagnifyingGlassIcon className="h-8 w-8 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
              <p className="text-gray-600">
                Sophisticated search algorithms, semantic analysis, and intelligent content discovery 
                that goes beyond simple keyword matching.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <UserGroupIcon className="h-8 w-8 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Open Source Freedom</h3>
              <p className="text-gray-600">
                Independent, open-source tools that researchers can customize, extend, 
                and integrate into their own workflows without platform restrictions.
              </p>
            </div>
          </div>
        </section>

        {/* What We Provide */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-8">What We Provide</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <BookOpenIcon className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Comprehensive Digital Library</h3>
                <p className="text-gray-600">
                  Access to Ellen G. White's complete published works with full-text search capabilities 
                  and advanced filtering options.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <DocumentTextIcon className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Publishing Tools</h3>
                <p className="text-gray-600">
                  Professional PDF generation with customizable formatting, copyright-compliant pagination, 
                  and citation management for academic and personal use.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <LightBulbIcon className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Research Compilation</h3>
                <p className="text-gray-600">
                  Automated topic research that searches across the entire corpus, compiles relevant 
                  passages, and generates formatted research documents.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology & Tools */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-6">Open Source Tools</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-gray-700 mb-4">
              All our tools are available as open-source packages that can be used independently:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>EGW PDF Generator:</strong> Standalone package for creating formatted PDFs from EGW writings</li>
              <li>• <strong>EGW Database Tools:</strong> Search and access utilities for working with EGW content</li>
              <li>• <strong>Research Compiler:</strong> Automated topic research and compilation tools</li>
              <li>• <strong>API Server:</strong> RESTful API for integrating EGW content into other applications</li>
            </ul>
            <div className="mt-4">
              <Link 
                href="https://github.com/gospelsounders/egw-writings-mcp/blob/main/docs/packages/README.md" 
                className="text-primary-600 hover:text-primary-700 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Package Documentation →
              </Link>
            </div>
          </div>
        </section>

        {/* Important Disclaimers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-6">Important Information</h2>
          
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Independence Notice</h3>
              <p className="text-amber-700">
                This is an independent project not officially affiliated with the Seventh-day Adventist Church 
                or the Ellen G. White Estate. We respect and acknowledge their authority over the official 
                Ellen G. White writings.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Educational Use</h3>
              <p className="text-blue-700">
                Our platform is designed exclusively for educational and research purposes. All content 
                is used under fair use guidelines, and users are responsible for ensuring their use 
                complies with applicable copyright laws.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Attribution & Respect</h3>
              <p className="text-green-700">
                We maintain deep respect for Ellen G. White's writings and their significance to the 
                Seventh-day Adventist community. All publications include proper attribution and 
                encourage readers to consult official sources.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-6">Contact & Support</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-gray-700 mb-4">
              Questions about the platform, technical support, or collaboration opportunities?
            </p>
            <div className="space-y-2">
              <p>
                <strong>Project Maintainer:</strong>{' '}
                <a 
                  href="https://github.com/surgbc" 
                  className="text-primary-600 hover:text-primary-700"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Brian Onango
                </a>
              </p>
              <p>
                <strong>Source Code:</strong>{' '}
                <a 
                  href="https://github.com/gospelsounders/egw-writings-mcp" 
                  className="text-primary-600 hover:text-primary-700"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  GitHub Repository
                </a>
              </p>
              <p>
                <strong>Documentation:</strong>{' '}
                <Link 
                  href="/docs/packages" 
                  className="text-primary-600 hover:text-primary-700"
                >
                  Package Documentation
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}