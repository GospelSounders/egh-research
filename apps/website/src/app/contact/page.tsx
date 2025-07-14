import { Metadata } from 'next';
import { 
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the EGW Research team for support, feedback, or collaboration opportunities.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold font-serif mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-primary-100">
            We'd love to hear from you. Get in touch for support, feedback, or collaboration.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* GitHub Issues */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Report Issues</h2>
                <p className="text-gray-600">Bug reports and technical problems</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Found a bug or experiencing technical difficulties? Report issues directly to our development team.
            </p>
            <a
              href="https://github.com/gospelsounders/egw-writings-mcp/issues/new?template=bug_report.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
              Report Bug
            </a>
          </div>

          {/* Feature Requests */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <LightBulbIcon className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Feature Requests</h2>
                <p className="text-gray-600">Ideas and enhancement suggestions</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Have an idea for improving the platform? We welcome feature requests and enhancement suggestions.
            </p>
            <a
              href="https://github.com/gospelsounders/egw-writings-mcp/issues/new?template=feature_request.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              <LightBulbIcon className="h-4 w-4 mr-2" />
              Request Feature
            </a>
          </div>

          {/* General Questions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">General Questions</h2>
                <p className="text-gray-600">Usage help and general inquiries</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Need help using the platform or have general questions? Start a discussion with our community.
            </p>
            <a
              href="https://github.com/gospelsounders/egw-writings-mcp/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Ask Question
            </a>
          </div>

          {/* Contributing */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <CodeBracketIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Contributing</h2>
                <p className="text-gray-600">Development and collaboration</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Interested in contributing to the project? Check out our contribution guidelines and open issues.
            </p>
            <a
              href="https://github.com/gospelsounders/egw-writings-mcp/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <CodeBracketIcon className="h-4 w-4 mr-2" />
              Contribute
            </a>
          </div>
        </div>

        {/* Project Maintainer */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Project Maintainer</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">BO</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Brian Onango</h3>
                <p className="text-gray-600 mb-4">Full-Stack Developer & Project Lead</p>
                <p className="text-gray-700 mb-4">
                  Creator and maintainer of the EGW Research platform. Passionate about combining technology 
                  with spiritual education to make Ellen G. White's writings more accessible for research and study.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/GospelSounders"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    GitHub Profile →
                  </a>
                  <a
                    href="https://github.com/gospelsounders"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Gospel Sounders →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Response Times */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">What to Expect</h2>
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Bug Reports</h3>
                <p className="text-blue-700">
                  Critical bugs: 24-48 hours<br />
                  General bugs: 3-7 days
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Feature Requests</h3>
                <p className="text-blue-700">
                  Initial response: 1-2 weeks<br />
                  Implementation varies
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">General Questions</h3>
                <p className="text-blue-700">
                  Community support: 1-3 days<br />
                  Maintainer response varies
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Alternative Contact */}
        <section>
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Other Ways to Connect</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-4">
              <div className="flex items-center">
                <CodeBracketIcon className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <span className="font-medium text-gray-900">Source Code:</span>
                  <a 
                    href="https://github.com/GospelSounders/egh-research" 
                    className="ml-2 text-primary-600 hover:text-primary-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/GospelSounders/egh-research
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <span className="font-medium text-gray-900">Discussions:</span>
                  <a 
                    href="https://github.com/GospelSounders/egh-research/discussions" 
                    className="ml-2 text-primary-600 hover:text-primary-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Community Forum
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <span className="font-medium text-gray-900">Organization:</span>
                  <a 
                    href="https://github.com/gospelsounders" 
                    className="ml-2 text-primary-600 hover:text-primary-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Gospel Sounders
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}