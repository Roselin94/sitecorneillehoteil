import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import { getActiveRooms, getActiveSettings, DATA_UPDATED_EVENT } from '../services/dataService';

export const RoomsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('TOUS');
  const [rooms, setRooms] = useState(getActiveRooms);
  const [siteSettings, setSiteSettings] = useState(getActiveSettings);

  useEffect(() => {
    const refreshData = () => {
      setRooms(getActiveRooms());
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

  const categories = ['TOUS', 'Standard', 'Supérieure', 'Suite Deluxe', 'Suite Exécutive'];

  const filteredRooms = selectedCategory === 'TOUS'
    ? rooms
    : rooms.filter(r => r.category === selectedCategory);

  return (
    <div className="bg-[#040810] text-slate-100 min-h-screen py-12">
      {/* En-tête de page */}
      <div className="bg-gradient-to-b from-[#081120] to-[#040810] text-white py-16 px-4 mb-12 border-b border-[#c5a059]/25">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#e5c583] font-bold block mb-2">
            Hébergement de Prestige
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
            Nos Chambres & Suites
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base font-light">
            Découvrez nos espaces conçus pour vous procurer un repos absolu lors de votre séjour à {siteSettings.city}. Tous nos tarifs sont exprimés en Francs CFA ({siteSettings.currency}).
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filtres par catégorie */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'gold-gradient-bg shadow-md'
                  : 'bg-[#081120] text-slate-300 border border-white/10 hover:border-[#c5a059]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille des chambres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="navy-card rounded-2xl overflow-hidden shadow-xl flex flex-col sm:flex-row group transition-all"
            >
              <div className="sm:w-1/2 relative h-64 sm:h-auto overflow-hidden bg-black/50">
                <img
                  src={room.imageUrl}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#040810]/90 text-[#fce5b5] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#c5a059]/40">
                  {room.category}
                </span>
              </div>

              <div className="sm:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xl font-bold font-serif text-[#fce5b5]">
                      {room.pricePerNight.toLocaleString('fr-FR')} {siteSettings.currency}
                    </span>
                    <span className="text-xs text-slate-400">/ nuit</span>
                  </div>

                  <h2 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-[#e5c583] transition-colors">
                    {room.name}
                  </h2>

                  <p className="text-slate-400 text-xs sm:text-sm mb-4 line-clamp-3 leading-relaxed">
                    {room.shortDescription}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300 mb-6 bg-[#040810]/60 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center">
                      <Users className="w-3.5 h-3.5 mr-2 text-[#c5a059]" />
                      <span>Capacité : Jusqu'à {room.capacityAdults} adulte(s)</span>
                    </div>
                    <div>
                      <span>Surface : <strong>{room.sizeM2} m²</strong> • {room.bedType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                  <Link
                    to={`/chambres/${room.slug}`}
                    className="text-xs font-bold text-[#e5c583] hover:text-white transition-colors flex items-center"
                  >
                    En savoir plus <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                  <Link
                    to={`/reservation?room=${room.id}`}
                    className="gold-gradient-bg font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg shadow"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
