import Link from 'next/link';

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'Browse Books', href: '/books' },
    { name: 'Search', href: '/search' },
    { name: 'Research', href: '/research' },
    { name: 'About', href: '/about' },
  ],
  tools: [
    { name: 'Browse Books', href: '/books' },
    { name: 'Research Compiler', href: '/research/compile' },
    { name: 'Advanced Search', href: '/search/advanced' },
    { name: 'Package Documentation', href: '/docs/packages' },
  ],
  resources: [
    { name: 'User Guide', href: '/docs/guide' },
    { name: 'FAQ', href: '/docs/faq' },
    { name: 'GitHub Repository', href: 'https://github.com/gospelsounders/egw-writings-mcp' },
    { name: 'Support', href: '/support' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Copyright Notice', href: '/legal/copyright' },
    { name: 'Contact', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center px-1">
                <span className="text-white font-bold text-xs">EGH</span>
              </div>
              <span className="font-serif font-semibold text-xl text-gray-900">
                Research
              </span>
            </Link>
            <p className="text-gray-600 text-sm">
              Independent research platform for Ellen G. White writings. Search, study, 
              and compile research with powerful digital tools.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Tools
            </h3>
            <ul className="mt-4 space-y-2">
              {navigation.tools.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-primary-600 text-xs transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} Gospel Sounders. Built for educational and research purposes.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Made with ❤️ by{' '}
                <a
                  href="https://github.com/GospelSounders"
                  className="text-primary-600 hover:text-primary-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Brian Onango
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer notice */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-xs text-center">
            <strong>Disclaimer:</strong> This is an independent project not officially affiliated with the Seventh-day Adventist Church or the Ellen G. White Estate. 
            Content is used for educational and research purposes. Users are responsible for ensuring their use complies with applicable copyright laws and fair use guidelines.
          </p>
        </div>
      </div>
    </footer>
  );
}