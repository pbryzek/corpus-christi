import { MapPin, Phone, Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageData } from '../lib/usePageData';

const staffContacts = [
  { name: 'Fr. Leo', role: 'Pastor', email: 'office@cc-parish.org', photo: '/Leo_headshot.png' },
  { name: 'Ankie Edgar', role: 'Assistant to the Pastor', email: 'pastoralcare@cc-parish.org', photo: '/ankie.png' },
  { name: 'Ann Endress', role: 'Office Manager', email: 'office@cc-parish.org', photo: '/Ann_Endress.jpeg' },
  { name: 'Joe Hébert', role: 'Music Director', email: 'ccmusic322@gmail.com', photo: '/joe.png' },
  { name: 'Adrian Mison Fulay', role: 'Confirmation Director', email: 'confirmation@cc-parish.org', photo: '/adrian.png' },
  { name: 'Mele Mortonson', role: 'School Principal', email: 'principal.mm@corpuschristischool.com', photo: '/mele.jpg' },
  { name: 'Rebeccah Pelle', role: 'Family Faith Formation Director', email: 'familyfaith@cc-parish.org', photo: '/rebecca.png' },
  { name: 'Anne Kallin Zehren', role: 'Pastoral Director and OCIA', email: 'ministry@cc-parish.org', photo: '/Screenshot_2026-05-12_114024.png' },
];

export default function Contact() {
  const { content } = usePageData('contact');
  const hero = content['hero'];
  return (
    <section id="contact" className="bg-white">
      <div className="bg-slate-900 text-white py-20 px-6 text-center">
        <p className="text-base font-semibold tracking-widest uppercase text-gray-400">
          {hero?.title || 'Contact Us'}
        </p>
        {hero?.subtitle && (
          <p className="text-base text-gray-300 mt-4 max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-8 pb-6 border-b border-gray-200">Find Us</h2>

            <div className="flex gap-4 items-start mb-6">
              <MapPin size={20} className="text-slate-900 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold tracking-wider uppercase text-gray-400 mb-1">
                  Address
                </p>
                <p className="text-base text-slate-900 leading-relaxed">
                  322 St. James Drive
                  <br />
                  Piedmont, CA
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start mb-6">
              <Phone size={20} className="text-slate-900 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold tracking-wider uppercase text-gray-400 mb-1">
                  Phone
                </p>
                <p className="text-base text-slate-900">510.530.4343</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Mail size={20} className="text-slate-900 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold tracking-wider uppercase text-gray-400 mb-1">
                  General Email
                </p>
                <a
                  href="mailto:office@cc-parish.org"
                  className="text-base text-slate-900 border-b border-slate-900"
                >
                  office@cc-parish.org
                </a>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-8 pb-6 border-b border-white/15">Mass Times</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-base text-gray-400">Saturday Vigil</span>
                <span className="text-base font-semibold">5:00pm</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-base text-gray-400">Sunday</span>
                <span className="text-base font-semibold">8:00am & 10:30am</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-base text-gray-400">Daily Mass (Mon–Fri)</span>
                <span className="text-base font-semibold">8:00am</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Getting Here</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <iframe
              title="Corpus Christi Church location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3148.7!2d-122.2148142!3d37.8130274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f87a178176f07%3A0xe7ed743cf4f460af!2sCorpus%20Christi%20Church!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="450"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">Reach Our Staff Directly</h2>
          <p className="text-base text-gray-600 mb-6">For ministry-specific needs, our team is here.</p>

          <div className="grid md:grid-cols-2 gap-4">
            {staffContacts.map((staff) => {
              const isAnne = staff.name === 'Anne Kallin Zehren';
              const cardClassName = `border border-gray-200 rounded-lg p-4 bg-white flex gap-4 items-center${isAnne ? ' hover:border-slate-900 transition cursor-pointer' : ''}`;

              const cardContent = (
                <>
                  <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {staff.photo ? (
                      <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-0.5">{staff.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{staff.role}</p>
                    <a
                      href={`mailto:${staff.email}`}
                      className="text-sm text-slate-900 border-b border-slate-900"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {`Contact ${staff.name}`}
                    </a>
                  </div>
                </>
              );

              return isAnne ? (
                <Link key={staff.email} to="/staff?member=anne" className={cardClassName}>
                  {cardContent}
                </Link>
              ) : (
                <div key={staff.email} className={cardClassName}>
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
