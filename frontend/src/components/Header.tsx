import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar, Clock, Compass, ShieldCheck } from 'lucide-react';
import { getActiveSettings, DATA_UPDATED_EVENT } from '../services/dataService';

const socialLinks = [
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@corneilleatc?_r=1&_t=ZS-9AnYqJbWsLe',
    icon: (
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.9 2.9 0 0 1-2.9 2.9 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .59.05.86.14V9.38a6.4 6.4 0 0 0-.86-.06A6.36 6.36 0 0 0 3.11 15.7a6.36 6.36 0 0 0 6.36 6.36 6.36 6.36 0 0 0 6.36-6.36V9.14a8.2 8.2 0 0 0 4.8 1.55V7.24a4.85 4.85 0 0 1-1.04-.55Z" />
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/chez_les_corneilles_hotel?utm_source=qr',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6" r="0.8" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1Dexdpqmt5/?mibextid=wwXIfr',
    icon: (
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.5v3.1h2.8v8h3.2Z" />
    ),
  },
];

const SocialLinks: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`} aria-label="Réseaux sociaux">
    {socialLinks.map(({ label, href, icon }) => (
      <a
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Suivez-nous sur ${label}`}
        title={label}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c5a059]/35 text-[#e5c583] transition-colors hover:border-[#e5c583] hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e5c583]"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill={label === 'Instagram' ? 'none' : 'currentColor'}
          stroke={label === 'Instagram' ? 'currentColor' : 'none'}
          strokeWidth={label === 'Instagram' ? 1.8 : undefined}
          strokeLinecap={label === 'Instagram' ? 'round' : undefined}
          strokeLinejoin={label === 'Instagram' ? 'round' : undefined}
        >
          {icon}
        </svg>
      </a>
    ))}
  </div>
);

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(getActiveSettings);
  const location = useLocation();

  useEffect(() => {
    const refreshData = () => {
      setSiteSettings(getActiveSettings());
    };

    window.addEventListener(DATA_UPDATED_EVENT, refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener(DATA_UPDATED_EVENT, refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Nos Chambres', path: '/chambres' },
    { label: 'La Cave', path: '/la-cave' },
    { label: 'Galerie', path: '/galerie' },
    { label: 'À Propos', path: '/a-propos' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#040810]/95 backdrop-blur-xl border-b border-[#c5a059]/25 text-white transition-all shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      {/* Barre supérieure d'informations discrète & luxueuse */}
      <div className="bg-[#02050a] border-b border-white/5 py-1.5 px-4 text-[11px] tracking-wider text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-[#e5c583]">
              <Compass className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" />
              {siteSettings.city}, {siteSettings.country}
            </span>
            <span className="hidden sm:flex items-center text-slate-400">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" />
              Réception : {siteSettings.receptionHours}
            </span>
          </div>
          <div className="flex items-center space-x-5">
            <a
              href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
              className="flex items-center text-slate-300 hover:text-[#e5c583] transition-colors"
            >
              <Phone className="w-3 h-3 mr-1.5 text-[#c5a059]" />
              <span>{siteSettings.phone}</span>
            </a>
            <SocialLinks className="gap-1" />
            <Link
              to="/admin/login"
              className="hidden md:inline-flex items-center text-slate-400 hover:text-white transition-colors text-[10px] uppercase tracking-wider"
              title="Accès responsable"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#c5a059]" />
              <span>Espace Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et Nom */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/logo.png"
              alt="Logo Corneille Hôtel & Cave"
              className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.08em] text-white">
                CORNEILLE
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] tracking-[0.25em] text-[#e5c583] uppercase font-bold">
                HÔTEL & CAVE • POINTE-NOIRE
              </span>
            </div>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 text-xs uppercase tracking-widest font-semibold transition-all rounded-md ${
                  isActive(link.path)
                    ? 'text-[#fce5b5] bg-white/5 border-b-2 border-[#c5a059]'
                    : 'text-slate-300 hover:text-[#e5c583] hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Réserver */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/reservation"
              className="gold-gradient-bg font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-lg flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4 text-[#040810]" />
              <span>Réserver</span>
            </Link>
          </div>

          {/* Bouton Mobile */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              to="/reservation"
              className="gold-gradient-bg font-bold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-lg flex items-center"
            >
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#040810]" />
              <span>Réserver</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-200 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#c5a059]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Tiroir */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#040810] border-b border-[#c5a059]/30 px-5 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium tracking-wide ${
                isActive(link.path)
                  ? 'bg-white/10 text-[#fce5b5] font-bold border-l-2 border-[#c5a059]'
                  : 'text-slate-300 hover:bg-white/5 hover:text-[#e5c583]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-slate-400 hover:text-white py-1 flex items-center"
            >
              <ShieldCheck className="w-4 h-4 mr-1 text-[#c5a059]" />
              Connexion Responsable Hôtel
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
