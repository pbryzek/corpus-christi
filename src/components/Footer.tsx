import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-gray-200 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-6 mb-8">
          <Link to="/mass" className="text-base text-gray-600 hover:text-slate-900 border-b border-gray-300 pb-1 transition">
            Mass Times
          </Link>
          <Link to="/bulletins" className="text-base text-gray-600 hover:text-slate-900 border-b border-gray-300 pb-1 transition">
            Bulletins
          </Link>
          <Link to="/contact" className="text-base text-gray-600 hover:text-slate-900 border-b border-gray-300 pb-1 transition">
            Contact
          </Link>
          <a href="https://www.youtube.com/@corpuschristichurchpiedmont" target="_blank" rel="noopener noreferrer" className="text-base text-gray-600 hover:text-slate-900 border-b border-gray-300 pb-1 transition">
            Livestream Archive
          </a>
          <a href="https://www.oakdiocese.org/safe-environment/" target="_blank" rel="noopener noreferrer" className="text-base text-gray-600 hover:text-slate-900 border-b border-gray-300 pb-1 transition">
            Safe Environment
          </a>
          <a
            href="https://www.oakdiocese.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base text-gray-600 hover:text-slate-900 border-b border-gray-300 pb-1 transition"
          >
            Diocese of Oakland
          </a>
        </div>

        <div className="text-base text-gray-700 space-y-2 mb-8">
          <p>
            Saturday Vigil 5:00pm | Sunday 8:00am & 10:30am | Daily Mass Mon–Fri 8:00am
          </p>
          <p>
            322 St. James Drive, Piedmont, CA |{' '}
            <a href="tel:5105304343" className="hover:text-slate-900 transition">510.530.4343</a> |{' '}
            <a
              href="https://www.google.com/maps/place/Corpus+Christi+Church/@37.81302739999999,-122.2148142,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-slate-900 border-b border-gray-300 transition"
            >
              Map →
            </a>
          </p>
        </div>

        <a
          href="/calendar"
          className="inline-block px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg text-slate-900 hover:bg-gray-50 transition mb-6"
        >
          Calendar →
        </a>

        <p className="text-sm text-gray-500 italic">
          Corpus Christi is committed to the safety and protection of all children and vulnerable adults.{' '}
          <button className="text-gray-500 hover:text-slate-900 border-b border-gray-300 transition">
            Safe Environment Policy →
          </button>
        </p>

        <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Corpus Christi Church, Piedmont. Website by William Crosby &amp; Anne Zehren.{' '}
            <Link to="/privacy" className="hover:text-slate-600 transition underline">Privacy Policy</Link>
            {' '}&middot;{' '}
            <Link to="/preview" className="hover:text-slate-600 transition">Preview</Link>
          </p>
          <a
            href="/admin/login"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-slate-600 transition"
          >
            <Lock className="w-3 h-3" />
            Staff Login
          </a>
        </div>
      </div>
    </footer>
  );
}
