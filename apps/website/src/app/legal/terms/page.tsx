import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for EGW Research platform - usage guidelines and responsibilities.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-serif text-gray-900 mb-8">Terms of Service</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using the EGW Research platform, you agree to comply with and be bound by these Terms of Service. 
              If you do not agree with these terms, please do not use our services.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Purpose and Scope</h2>
            <p className="text-gray-700 mb-4">
              EGW Research is an independent platform designed for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Educational research and study of Ellen G. White writings</li>
              <li>Academic and scholarly research purposes</li>
              <li>Personal study and spiritual growth</li>
              <li>Non-commercial educational use</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
            <p className="text-gray-700 mb-4">Users agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Use the platform only for educational and research purposes</li>
              <li>Respect copyright laws and fair use guidelines</li>
              <li>Provide proper attribution when using generated content</li>
              <li>Not attempt to circumvent security measures</li>
              <li>Not use the platform for commercial distribution without permission</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Copyright and Fair Use</h2>
            <p className="text-gray-700 mb-6">
              All Ellen G. White content is used under fair use provisions for educational and research purposes. 
              Users are responsible for ensuring their use complies with applicable copyright laws. 
              Generated PDFs and compilations are for personal study and should not be redistributed commercially.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Independence Disclaimer</h2>
            <p className="text-gray-700 mb-6">
              This platform is an independent project not officially affiliated with the Seventh-day Adventist Church 
              or the Ellen G. White Estate. We acknowledge their authority over the official Ellen G. White writings 
              and encourage users to consult official sources.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Availability</h2>
            <p className="text-gray-700 mb-6">
              We strive to maintain service availability but cannot guarantee uninterrupted access. 
              The platform is provided "as is" without warranties of any kind, express or implied.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              The platform maintainers shall not be liable for any direct, indirect, incidental, or consequential 
              damages arising from your use of the platform. This includes any inaccuracies in content or 
              technical issues.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Open Source License</h2>
            <p className="text-gray-700 mb-6">
              This platform is released under the MIT License. The source code is available at{' '}
              <a href="https://github.com/gospelsounders/egw-writings-mcp" className="text-primary-600 hover:text-primary-700 underline">
                GitHub
              </a>{' '}
              for transparency and community contribution.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Continued use of the platform constitutes acceptance of modified terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700">
              For questions about these terms, please contact us through our{' '}
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