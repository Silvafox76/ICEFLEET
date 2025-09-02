import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-credit mt-auto dark:bg-gray-900 dark:border-t dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex justify-center items-center">
          <p className="text-sm text-gray-300 dark:text-gray-400">
            Built by{' '}
            <Link 
              href="https://FoxOnAI.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              FoxOnAI.com
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}