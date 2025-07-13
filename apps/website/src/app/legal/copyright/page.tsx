import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Copyright Notice',
  description: 'Copyright information and attribution for EGW Research platform content and usage guidelines.',
};

export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-serif text-gray-900 mb-8">Copyright Notice</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ellen G. White Writings</h2>
            <p className="text-gray-700 mb-4">
              The Ellen G. White writings contained in this platform are used under fair use provisions for 
              educational and research purposes. Copyright ownership varies by work:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Published Works:</strong> Many of Ellen G. White's published works are in the public domain</li>
              <li><strong>Estate Materials:</strong> Some materials may be under copyright of the Ellen G. White Estate</li>
              <li><strong>Compilations:</strong> Certain compilations and arrangements may have separate copyright protections</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Fair Use Declaration</h2>
            <p className="text-gray-700 mb-6">
              Our use of Ellen G. White writings qualifies as fair use under copyright law based on:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Purpose:</strong> Educational, research, and scholarly use</li>
              <li><strong>Nature:</strong> Religious and educational content for spiritual growth</li>
              <li><strong>Amount:</strong> Portions used are reasonable for educational purposes</li>
              <li><strong>Effect:</strong> Does not compete with or substitute for official publications</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Code and Design</h2>
            <p className="text-gray-700 mb-6">
              The EGW Research platform source code, design, and original content are licensed under the MIT License:
            </p>
            <div className="bg-gray-100 p-4 rounded-md text-sm font-mono mb-6">
              <p>Copyright (c) 2024 Gospel Sounders</p>
              <p className="mt-2">
                Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
                and associated documentation files (the "Software"), to deal in the Software without restriction.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">User-Generated Content</h2>
            <p className="text-gray-700 mb-6">
              PDFs and compilations generated through this platform:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Inherit the copyright status of the source materials</li>
              <li>Should include proper attribution to original sources</li>
              <li>Are intended for personal study and educational use</li>
              <li>Should not be distributed commercially without proper authorization</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Proper Attribution</h2>
            <p className="text-gray-700 mb-4">
              When using content from this platform, please include attribution such as:
            </p>
            <div className="bg-gray-100 p-4 rounded-md text-sm mb-6">
              <p><em>Source: [Original EGW Work Title], Ellen G. White</em></p>
              <p><em>Generated via EGW Research Platform (egwresearch.gospelsounders.org)</em></p>
              <p><em>For educational and research purposes only</em></p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Respect for Official Sources</h2>
            <p className="text-gray-700 mb-6">
              We acknowledge and respect the Ellen G. White Estate as the official custodian of Ellen G. White's writings. 
              This platform supplements but does not replace official publications. Users are encouraged to consult 
              official Estate publications for authoritative texts.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Copyright Concerns</h2>
            <p className="text-gray-700 mb-6">
              If you believe that any content on this platform infringes your copyright, please contact us through our{' '}
              <a href="https://github.com/gospelsounders/egw-writings-mcp/issues" className="text-primary-600 hover:text-primary-700 underline">
                GitHub repository
              </a>{' '}
              with detailed information about the alleged infringement. We will promptly investigate and take appropriate action.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Educational Use Guidelines</h2>
            <p className="text-gray-700 mb-4">
              To ensure compliance with copyright law:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Use generated content only for educational, research, or personal study</li>
              <li>Include proper attribution and source citations</li>
              <li>Do not use for commercial distribution or profit</li>
              <li>Respect the original intent and context of the writings</li>
              <li>Consider purchasing official publications to support the Ellen G. White Estate</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Important Notice</h3>
              <p className="text-blue-700 text-sm">
                This platform is an independent project not affiliated with the Ellen G. White Estate or 
                the Seventh-day Adventist Church. Copyright interpretations are made in good faith for 
                educational purposes. Users are responsible for ensuring their use complies with applicable laws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}