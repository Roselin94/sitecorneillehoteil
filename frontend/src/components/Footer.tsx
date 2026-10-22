import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageSquare, ShieldCheck, ChevronRight } from 'lucide-react';
import { getActiveSettings, DATA_UPDATED_EVENT } from '../services/dataService';

export const Footer: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState(getActiveSettings);

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

  return (
    <footer className="bg-[#02050a] text-slate-300 border-t border-[#c5a059]/30 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Colonne 1 : Présentation */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3.5">
              <img
                src="/logo.png"
                alt="Logo Corneille Hôtel & Cave"
                className="h-12 w-auto object-contain"
              />
              <div>
                <span className="font-serif text-lg font-bold tracking-wider text-white block">
                  CORNEILLE
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#e5c583] uppercase font-bold block">
                  HÔTEL & CAVE
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Votre adresse d'exception à Pointe-Noire. Alliant hébergement de grand confort, discrétion et sélection de crus prestigieux au sein de notre cave à vins.
            </p>
            <div className="pt-2">
              <span className="inline-block bg-[#081120] border border-[#c5a059]/40 text-[#fce5b5] text-[11px] px-3 py-1 rounded-full font-medium">
                Tarifs officiels en Francs CFA ({siteSettings.currency})
              </span>
            </div>
          </div>

          {/* Colonne 2 : Liens Rapides */}
          <div>
            <h4 className="font-serif text-white text-xs tracking-[0.2em] uppercase mb-5 pb-2 border-b border-[#c5a059]/25">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-[#e5c583] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" /> Accueil
                </Link>
              </li>
              <li>
                <Link to="/chambres" className="hover:text-[#e5c583] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" /> Nos Chambres & Suites
                </Link>
              </li>
              <li>
                <Link to="/la-cave" className="hover:text-[#e5c583] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" /> La Cave d'Exception
                </Link>
              </li>
              <li>
                <Link to="/galerie" className="hover:text-[#e5c583] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" /> Galerie Photos
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="hover:text-[#e5c583] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" /> À Propos de l'Hôtel
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#e5c583] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" /> FAQ & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Contact & Accès */}
          <div>
            <h4 className="font-serif text-white text-xs tracking-[0.2em] uppercase mb-5 pb-2 border-b border-[#c5a059]/25">
              Localisation & Contact
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-[#c5a059] shrink-0 mt-0.5" />
                <span className="text-slate-300">{siteSettings.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-[#c5a059] shrink-0" />
                <a href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} className="hover:text-[#e5c583] text-slate-300">
                  {siteSettings.phone}
                </a>
              </li>
              <li className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#e5c583] text-slate-300"
                >
                  WhatsApp : {siteSettings.whatsapp}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-[#c5a059] shrink-0" />
                <a href={`mailto:${siteSettings.email}`} className="hover:text-[#e5c583] text-slate-300">
                  {siteSettings.email}
                </a>
              </li>
              <li className="flex items-center text-slate-400">
                <Clock className="w-4 h-4 mr-2 text-[#c5a059] shrink-0" />
                <span>Heure locale : Pointe-Noire (GMT+1)</span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Réservation en ligne */}
          <div>
            <h4 className="font-serif text-white text-xs tracking-[0.2em] uppercase mb-5 pb-2 border-b border-[#c5a059]/25">
              Demande de Réservation
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 font-light">
              Transmettez votre demande en quelques instants. Toute réservation fait l'objet d'une validation rigoureuse par notre équipe de réception.
            </p>
            <Link
              to="/reservation"
              className="block text-center gold-gradient-bg font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-lg shadow-lg mb-4"
            >
              Envoyer une demande
            </Link>
            <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
              <Link to="/admin/login" className="hover:text-[#e5c583] flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#c5a059]" />
                Accès Direction / Administration
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} {siteSettings.name}. Tous droits réservés.</p>
          <p className="text-slate-400">Pointe-Noire, République du Congo</p>
        </div>
      </div>
    </footer>
  );
};
