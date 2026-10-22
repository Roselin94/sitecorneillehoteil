import React, { useState, useEffect } from 'react';
import { Wine, Sparkles, Award, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { getActiveWines, getActiveSettings, DATA_UPDATED_EVENT } from '../services/dataService';

export const WineCellarPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('TOUS');
  const [wines, setWines] = useState(getActiveWines);
  const [siteSettings, setSiteSettings] = useState(getActiveSettings);

  useEffect(() => {
    const refreshData = () => {
      setWines(getActiveWines());
      setSiteSettings(getActiveSettings());
    };

    refreshData();
    window.addEventListener(DATA_UPDATED_EVENT, refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener(DATA_UPDATED_EVENT, refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  const categories = ['TOUS', 'Vin Rouge', 'Vin Blanc', 'Champagne', 'Spiritueux', 'Rosé'];

  const filteredWines = selectedCat === 'TOUS'
    ? wines
    : wines.filter(w => w.category === selectedCat);

  return (
    <div className="bg-[#040810] text-slate-100 min-h-screen py-12">
      {/* Header Sombre Prestigieux */}
      <div className="bg-gradient-to-b from-[#081120] to-[#040810] text-white py-20 px-4 mb-12 border-b border-[#c5a059]/25 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-[#c5a059]/40 text-[#e5c583] text-xs font-semibold uppercase tracking-widest mb-4">
            <Wine className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>L'Espace Œnologique de {siteSettings.city}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-6xl font-bold mb-6">
            La Cave <span className="gold-gradient-text font-serif italic">Corneille</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            Une sélection rigoureuse des plus grands domaines viticoles et distilleries d'exception. Dégustation sur place, accompagnement de vos dîners ou service de vente à emporter avec emballages de prestige.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Présentation du concept */}
        <div className="navy-card rounded-2xl p-8 sm:p-10 mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-2 flex items-center">
              <Sparkles className="w-4 h-4 text-[#c5a059] mr-2" />
              Conservation Maîtrisée
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Cave entièrement thermo-régulée et protégée de la lumière pour garantir la stabilité et l'expression aromatique intacte de chaque flacon sous le climat tropical.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-2 flex items-center">
              <Award className="w-4 h-4 text-[#c5a059] mr-2" />
              Flacons Rares & Millésimes
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Des Grands Crus Classés de Bordeaux aux prestigieux terroirs bourguignons et champagnes réputés, soigneusement sélectionnés par notre sommelier.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-2 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-[#c5a059] mr-2" />
              Conseils Personnalisés
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Nos équipes vous orientent selon vos préférences pour vos repas, réceptions d'affaires ou cadeaux d'entreprise de grand standing.
            </p>
          </div>
        </div>

        {/* Filtres de catégorie */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCat === cat
                  ? 'gold-gradient-bg shadow'
                  : 'bg-[#081120] text-slate-300 border border-white/10 hover:border-[#c5a059]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Liste des vins et spiritueux dynamiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredWines.map((wine) => (
            <div
              key={wine.id}
              className="navy-card rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group"
            >
              <div className="relative h-64 overflow-hidden bg-black/60">
                <img
                  src={wine.imageUrl}
                  alt={wine.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#040810]/90 text-[#fce5b5] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#c5a059]/40">
                  {wine.category}
                </span>
                {wine.year && (
                  <span className="absolute top-4 right-4 bg-[#081120]/95 text-white text-xs font-serif font-bold px-2.5 py-1 rounded-lg border border-[#c5a059]/40">
                    Millésime {wine.year}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">{wine.origin}</span>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#e5c583] transition-colors">
                    {wine.name}
                  </h3>
                  {wine.description && (
                    <p className="text-xs sm:text-sm text-slate-400 mb-4 leading-relaxed line-clamp-2">
                      {wine.description}
                    </p>
                  )}
                  {wine.tastingNotes && (
                    <div className="bg-[#040810]/70 p-3 rounded-xl border border-white/5 mb-4">
                      <span className="text-[10px] font-bold text-[#e5c583] uppercase tracking-wider block mb-1">
                        Notes de dégustation :
                      </span>
                      <p className="text-xs text-slate-300 italic">
                        « {wine.tastingNotes} »
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-serif font-bold text-base text-[#fce5b5]">
                    {wine.price ? `${wine.price.toLocaleString('fr-FR')} ${siteSettings.currency}` : 'Prix sur consultation'}
                  </span>
                  <a
                    href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20le%20flacon%20%3A%20${encodeURIComponent(wine.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-gradient-bg text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg shadow flex items-center space-x-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#040810]" />
                    <span>Commander</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bannière contact dégustation privée */}
        <div className="navy-card rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
            Organisation de Dégustations Privées & Événements
          </h3>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm mb-8 leading-relaxed font-light">
            Vous souhaitez réserver l'espace dégustation pour vos réceptions privées ou dîners professionnels à {siteSettings.city} ? Contactez directement notre équipe pour une formule sur mesure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
              className="gold-gradient-bg font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-lg flex items-center space-x-2 shadow-lg"
            >
              <Phone className="w-4 h-4 text-[#040810]" />
              <span>Appeler la réception</span>
            </a>
            <a
              href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg transition-all flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Échanger sur WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
