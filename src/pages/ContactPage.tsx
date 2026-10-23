import { Link } from 'react-router-dom';
import Contact from '../components/Contact';

export default function ContactPage() {
  return (
    <div className="bg-white">
      <Contact />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Parish Office Hours</h2>
            <div className="space-y-2 text-gray-600">
              <p>Monday - Thursday: 9:00 AM - 3:00 PM</p>
              <p>Friday: 9:00 AM - 12:00 PM</p>
              <p>Saturday & Sunday: Closed</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Links</h2>
            <div className="space-y-3">
              <Link to="/mass" className="block text-slate-900 hover:text-slate-600 transition">
                Mass Times
              </Link>
              <Link to="/faith-formation" className="block text-slate-900 hover:text-slate-600 transition">
                Faith Formation
              </Link>
              <Link to="/ministries" className="block text-slate-900 hover:text-slate-600 transition">
                Ministries
              </Link>
              <Link to="/give" className="block text-slate-900 hover:text-slate-600 transition">
                Give
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
