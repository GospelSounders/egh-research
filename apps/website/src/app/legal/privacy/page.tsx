import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for EGW Research platform - how we handle your data and protect your privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-serif text-gray-900 mb-8">Privacy Policy</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              EGW Research is designed with privacy in mind. We collect minimal information necessary to provide our services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Search queries (temporarily stored for performance optimization)</li>
              <li>Usage analytics (anonymized and aggregated)</li>
              <li>Technical logs for debugging and security purposes</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">What We Don't Collect</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Personal identifying information</li>
              <li>Email addresses or contact information</li>
              <li>Account registrations or user profiles</li>
              <li>Cookies for tracking or advertising</li>
              <li>Third-party analytics or advertising trackers</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">How We Use Information</h2>
            <p className="text-gray-700 mb-4">
              The limited information we collect is used solely to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Provide search functionality and content delivery</li>
              <li>Improve platform performance and user experience</li>
              <li>Ensure security and prevent abuse</li>
              <li>Generate anonymous usage statistics</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Storage and Security</h2>
            <p className="text-gray-700 mb-6">
              All data is stored securely with industry-standard encryption. Search queries are automatically deleted after 30 days. 
              We do not share any information with third parties for commercial purposes.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Open Source Transparency</h2>
            <p className="text-gray-700 mb-6">
              This platform is open source, and our privacy practices can be verified by examining our code repository at{' '}
              <a href="https://github.com/gospelsounders/egw-writings-mcp" className="text-primary-600 hover:text-primary-700 underline">
                GitHub
              </a>.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700">
              If you have questions about this privacy policy, please contact us through our{' '}
              <a href="https://github.com/gospelsounders/egw-writings-mcp/issues" className="text-primary-600 hover:text-primary-700 underline">
                GitHub repository
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}