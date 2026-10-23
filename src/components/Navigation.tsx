import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Play } from 'lucide-react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [faithFormationDropdownOpen, setFaithFormationDropdownOpen] = useState(false);
  const [ministriesDropdownOpen, setMinistriesDropdownOpen] = useState(false);
  const [groupsDropdownOpen, setGroupsDropdownOpen] = useState(false);
  const [massDropdownOpen, setMassDropdownOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: 'New? Yes!', href: '/new-visitors', isRoute: true },
    {
      label: 'About',
      href: '/about',
      isRoute: true,
      hasDropdown: true,
      dropdownState: aboutDropdownOpen,
      setDropdownState: setAboutDropdownOpen,
      subItems: [
        { label: 'Mission & Values', href: '/about#mission',    isRoute: true },
        { label: 'Why Corpus?',      href: '/about#why-corpus', isRoute: true },
        { label: 'Meet Our Staff',   href: '/about#staff',      isRoute: true },
        { label: 'Contact Us',       href: '/about#contact',    isRoute: true },
      ]
    },
    {
      label: 'Mass',
      href: '/mass',
      isRoute: true,
      hasDropdown: true,
      dropdownState: massDropdownOpen,
      setDropdownState: setMassDropdownOpen,
      subItems: [
        { label: 'Calendar', href: '/calendar', isRoute: true },
        { label: 'Pastor Calendar', href: '/Priest_calendar.pdf', isRoute: false },
        { label: 'Bulletins & Worship Aid', href: '/bulletins', isRoute: true },
      ]
    },
    {
      label: 'Faith Formation',
      href: '/faith-formation',
      isRoute: true,
      hasDropdown: true,
      dropdownState: faithFormationDropdownOpen,
      setDropdownState: setFaithFormationDropdownOpen,
      subItems: [
        { label: 'Family Faith Formation', href: '/family-faith-formation', isRoute: true },
        { label: 'Confirmation', href: '/confirmation', isRoute: true },
        { label: 'OCIA', href: '/ocia', isRoute: true },
        { label: 'Sacraments', href: '/sacraments', isRoute: true },
        { label: 'FORMED', href: '/formed', isRoute: true },
      ]
    },
    {
      label: 'Ministries',
      href: '/ministries',
      isRoute: true,
      hasDropdown: true,
      dropdownState: ministriesDropdownOpen,
      setDropdownState: setMinistriesDropdownOpen,
      subItems: [
        { label: 'Music Ministry', href: '/music-ministry', isRoute: true },
        { label: 'Lectors, Altar Servers & Eucharistic Ministers', href: '/lectors-altar-eucharistic', isRoute: true },
        { label: 'Greeters & Ushers', href: '/greeters-ushers', isRoute: true },
        { label: 'Altar Guild, Hospitality & Environmental', href: '/altarguild-hospitality', isRoute: true },
        { label: 'Ministry to the Homebound & Grief Support', href: '/homebound-grief', isRoute: true },
      ]
    },
    {
      label: 'Groups',
      href: '/groups',
      isRoute: true,
      hasDropdown: true,
      dropdownState: groupsDropdownOpen,
      setDropdownState: setGroupsDropdownOpen,
      subItems: [
        { label: 'Family Circle', href: '/family-circle', isRoute: true },
        { label: 'GenX-ish Fellowship', href: '/genxish', isRoute: true },
        { label: 'Living Our Faith', href: '/living-our-faith', isRoute: true },
        { label: "Men's Club", href: 'https://www.ccmensclub.org/', isRoute: false },
        { label: 'Centering Prayer', href: '/groups', isRoute: true },
        { label: "WINGS (Women in God's Spirit)", href: '/groups', isRoute: true },
        { label: 'Genesis', href: '/groups', isRoute: true },
      ]
    },
    { label: 'School', href: 'https://www.corpuschristischool.com/' },
    { label: 'Give', href: '/give', isRoute: true },
    { label: 'Livestream', href: 'https://www.youtube.com/@corpuschristichurchpiedmont' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-blue-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 cursor-pointer">
              <img src="/churchimg.png" alt="Corpus Christi Parish, Piedmont CA" className="h-[60px] w-auto" />
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-medium text-stone-900">Corpus Christi</span>
                <span className="text-sm text-indigo-700 tracking-wide">Piedmont, CA</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = link.isRoute && location.pathname === link.href;

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => link.setDropdownState(true)}
                    onMouseLeave={() => link.setDropdownState(false)}
                  >
                    <Link
                      to={link.href}
                      className={`text-base hover:text-slate-900 transition flex items-center gap-1 ${
                        isActive
                          ? 'font-bold text-slate-900 border-b-2 border-slate-900 pb-0.5'
                          : 'text-gray-600'
                      }`}
                    >
                      {link.label}
                      <ChevronDown size={16} className={`transition-transform ${link.dropdownState ? 'rotate-180' : ''}`} />
                    </Link>

                    {link.dropdownState && (
                      <div className="absolute top-full left-0 pt-2">
                        <div className="w-64 bg-white shadow-lg rounded-lg border border-gray-200 py-2">
                          {link.subItems?.map((subItem) =>
                            subItem.isRoute ? (
                              <Link
                                key={subItem.label}
                                to={subItem.href}
                                className="block px-4 py-2 text-base text-gray-600 hover:bg-gray-50 hover:text-slate-900 transition"
                              >
                                {subItem.label}
                              </Link>
                            ) : (
                              <a
                                key={subItem.label}
                                href={subItem.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-base text-gray-600 hover:bg-gray-50 hover:text-slate-900 transition"
                              >
                                {subItem.label}
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-base transition ${
                    link.label === 'New? Yes!'
                      ? 'bg-blue-900 text-white font-semibold px-3 py-1 rounded-full hover:bg-blue-800 animate-pulse'
                      : isActive
                        ? 'font-bold text-slate-900 border-b-2 border-slate-900 pb-0.5 hover:text-slate-900'
                        : 'text-gray-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-base transition flex items-center gap-1.5 ${
                    link.label === 'New? Yes!'
                      ? 'bg-blue-900 text-white font-semibold px-3 py-1 rounded-full hover:bg-blue-800 animate-pulse'
                      : 'text-gray-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {link.label === 'Livestream' && <Play size={16} fill="currentColor" />}
                </a>
              );
            })}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-2">
            {links.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div key={link.href + link.label} className="space-y-1">
                    <Link
                      to={link.href}
                      className="block px-4 py-2 text-base text-gray-600 hover:bg-gray-50 rounded font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                    <div className="pl-4 space-y-1">
                      {link.subItems?.map((subItem) =>
                        subItem.isRoute ? (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className="block px-4 py-2 text-base text-gray-500 hover:bg-gray-50 rounded"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ) : (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-base text-gray-500 hover:bg-gray-50 rounded"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                );
              }

              return link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-4 py-2 text-base rounded ${
                    link.label === 'New? Yes!'
                      ? 'text-blue-900 font-semibold animate-pulse'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block px-4 py-2 text-base hover:bg-gray-50 rounded flex items-center gap-1.5 ${
                    link.label === 'New? Yes!'
                      ? 'text-blue-900 font-semibold animate-pulse'
                      : 'text-gray-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                  {link.label === 'Livestream' && <Play size={16} fill="currentColor" />}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
