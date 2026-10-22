import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Users, ArrowRight, ShieldCheck, Wine, BedDouble,
  Sparkles, CheckCircle2
} from 'lucide-react';
import { getActiveRooms, getActiveWines, getActiveSettings, DATA_UPDATED_EVENT } from '../services/dataService';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const [rooms, setRooms] = useState(getActiveRooms);
  const [wines, setWines] = useState(getActiveWines);
  const [siteSettings, setSiteSettings] = useState(getActiveSettings);

  useEffect(() => {
    const refreshData = () => {
      setRooms(getActiveRooms());
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

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/reservation?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#040810] text-slate-100 selection:bg-[#c5a059] selection:text-[#040810]">
      {/* SECTION HERO SPECTACULAIRE */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85"
            alt="Corneille Hôtel Prestige"
            className="w-full h-full object-cover opacity-40 scale-105 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040810] via-[#040810]/70 to-[#040810]/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040810] via-transparent to-[#040810]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#c5a059]/10 rounded-full blur-[130px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-14 pb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#081120]/80 border border-[#c5a059]/40 text-[#fce5b5] text-[11px] font-semibold uppercase tracking-[0.25em] mb-6 shadow-2xl backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-[#e5c583]" />
            <span>{siteSettings.city} • {siteSettings.country}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-5 leading-[1.18]">
            L'Excellence Hôtelière & <br />
            <span className="gold-gradient-text font-serif italic font-normal">L'Art de la Dégustation</span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-300/90 font-light mb-8 leading-relaxed">
            Bienvenue au <strong className="text-white font-medium">{siteSettings.name}</strong>. Une parenthèse de distinction au cœur de la capitale économique, conjuguant hébergements de prestige, intimité totale et sélection exclusive de grands crus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
            <Link
              to="/reservation"
              className="w-full sm:w-auto gold-gradient-bg font-bold text-xs uppercase tracking-[0.18em] px-7 py-3 rounded-lg flex items-center justify-center space-x-2 shadow-2xl"
            >
              <Calendar className="w-3.5 h-3.5 text-[#040810]" />
              <span>Demande de Réservation</span>
            </Link>
            <Link
              to="/chambres"
              className="w-full sm:w-auto bg-[#081120]/80 hover:bg-[#0f1d36] text-white font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded-lg border border-[#c5a059]/35 backdrop-blur-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Explorer les Chambres</span>
              <ArrowRight className="w-4 h-4 text-[#c5a059]" />
            </Link>
          </div>

          {/* Module de Réservation rapide */}
          <div className="navy-card rounded-2xl p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-w-4xl mx-auto text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" />
            <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#fce5b5] font-bold mb-2 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" /> Arrivée
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-[#040810]/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#fce5b5] font-bold mb-2 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" /> Départ
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-[#040810]/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#fce5b5] font-bold mb-2 flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" /> Voyageurs
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-[#040810]/80 border border-white/15 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
                >
                  <option value="1">1 Personne</option>
                  <option value="2">2 Personnes</option>
                  <option value="3">3 Personnes</option>
                  <option value="4">4 Personnes et plus</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full gold-gradient-bg font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
                >
                  <span>Vérifier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#040810]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* SECTION 3 PILIERS D'EXCEPTION */}
      <section className="py-20 bg-gradient-to-b from-[#040810] via-[#081120] to-[#040810] border-y border-[#c5a059]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="navy-card p-8 rounded-2xl relative group">
              <div className="w-14 h-14 rounded-xl gold-gradient-bg flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform">
                <BedDouble className="w-7 h-7 text-[#040810]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Confort & Sérénité</h3>
              <p className="text-sm text-slate-300/80 leading-relaxed">
                Chambres haut de gamme insonorisées, literie sur-mesure digne des plus grands palaces et climatisation discrète pour des nuits paisibles à Pointe-Noire.
              </p>
            </div>

            <div className="navy-card p-8 rounded-2xl relative group">
              <div className="w-14 h-14 rounded-xl gold-gradient-bg flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform">
                <Wine className="w-7 h-7 text-[#040810]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">La Cave à Vins Rares</h3>
              <p className="text-sm text-slate-300/80 leading-relaxed">
                Une cave thermo-régulée abritant une collection prisée de grands crus français, champagnes millésimés et spiritueux de haute lignée.
              </p>
            </div>

            <div className="navy-card p-8 rounded-2xl relative group">
              <div className="w-14 h-14 rounded-xl gold-gradient-bg flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-7 h-7 text-[#040810]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Validation Manuelle Dédiée</h3>
              <p className="text-sm text-slate-300/80 leading-relaxed">
                Chaque demande est traitée personnellement par notre responsable. Aucun prélèvement immédiat, aucune déconvenue de double réservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION NOS CHAMBRES VEDETTES DYNAMIQUES */}
      <section className="py-24 bg-[#040810] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#e5c583] font-bold block mb-3">
              Hospitalité Haut de Gamme
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
              Nos Suites & Hébergements
            </h2>
            <div className="ornament-line my-4">
              <Sparkles className="w-4 h-4 text-[#c5a059]" />
            </div>
            <p className="text-slate-400 text-sm sm:text-base font-light">
              Des espaces aménagés avec noblesse et raffinement, équipés pour les cadres, diplomates et voyageurs exigeants en escale à Pointe-Noire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.slice(0, 3).map((room) => (
              <div
                key={room.id}
                className="navy-card rounded-2xl overflow-hidden shadow-2xl flex flex-col group transition-all duration-500"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081120] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#040810]/90 text-[#fce5b5] text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full uppercase border border-[#c5a059]/40 backdrop-blur-md">
                      {room.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-[#040810]/95 text-white text-sm font-serif font-bold px-3.5 py-1.5 rounded-lg border border-[#c5a059]/50 shadow-xl">
                      {room.pricePerNight.toLocaleString('fr-FR')} {siteSettings.currency} <span className="text-[11px] font-sans font-normal text-slate-400">/ nuit</span>
                    </span>
                  </div>
                </div>

                <div className="p-7 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-[#e5c583] transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {room.shortDescription}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-slate-300 mt-4 pt-4 border-t border-white/10">
                      <span className="flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-[#c5a059]" />
                        {room.capacityAdults} Adulte(s)
                      </span>
                      <span>•</span>
                      <span>{room.sizeM2} m²</span>
                      <span>•</span>
                      <span>{room.bedType}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <Link
                      to={`/chambres/${room.slug}`}
                      className="text-xs font-bold text-[#e5c583] hover:text-white transition-colors flex items-center"
                    >
                      Détails de la chambre <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                    <Link
                      to={`/reservation?room=${room.id}`}
                      className="gold-gradient-bg font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg shadow"
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              to="/chambres"
              className="inline-flex items-center space-x-2 text-[#e5c583] hover:text-white font-bold text-xs uppercase tracking-widest border-b border-[#c5a059] pb-1 transition-colors"
            >
              <span>Découvrir l'ensemble des suites & chambres</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION LA CAVE DYNAMIQUE */}
      <section className="py-24 bg-gradient-to-b from-[#081120] via-[#050b15] to-[#040810] text-white relative overflow-hidden border-t border-[#c5a059]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#e5c583] font-bold block mb-3">
                L'Art Œnologique
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-6 leading-tight">
                La Cave <br />
                <span className="gold-gradient-text font-serif italic">Grands Crus & Flacons d'Élite</span>
              </h2>
              <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed mb-6 font-light">
                Prolongez votre séjour en découvrant l'un des secrets les mieux gardés de Pointe-Noire : notre cave privée. Nous proposons aux hôtes de l'hôtel ainsi qu'aux amateurs de vins une sélection incomparable de terroirs bordelais, bourguignons, champagnes prestigieux et spiritueux rares.
              </p>
              <ul className="space-y-3.5 mb-8 text-sm text-slate-300">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059] mr-3 shrink-0" />
                  <span>Conservation à température et humidité strictement régulées</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059] mr-3 shrink-0" />
                  <span>Dégustation sur place au salon intime ou service en chambre</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059] mr-3 shrink-0" />
                  <span>Coffrets cadeaux et réceptions professionnelles personnalisées</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/la-cave"
                  className="gold-gradient-bg font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-lg flex items-center space-x-2"
                >
                  <Wine className="w-4 h-4 text-[#040810]" />
                  <span>Explorer la Carte des Vins</span>
                </Link>
                <Link
                  to="/contact"
                  className="bg-[#081120]/80 hover:bg-[#0f1d36] text-white font-semibold text-xs uppercase tracking-wider px-7 py-4 rounded-lg border border-white/20 transition-all"
                >
                  Commander / Renseignements
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {wines.slice(0, 4).map((wine) => (
                <div
                  key={wine.id}
                  className="navy-card rounded-2xl p-4 flex flex-col justify-between group"
                >
                  <div className="h-44 rounded-xl overflow-hidden mb-3 bg-black/40">
                    <img
                      src={wine.imageUrl}
                      alt={wine.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] tracking-widest text-[#e5c583] font-bold uppercase block">
                      {wine.category}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-white mb-1 line-clamp-1">
                      {wine.name}
                    </h4>
                    <p className="text-xs font-serif font-bold text-[#fce5b5]">
                      {wine.price ? `${wine.price.toLocaleString('fr-FR')} ${siteSettings.currency}` : 'Sur demande'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BANNIÈRE APPEL À L'ACTION LUXE */}
      <section className="py-20 bg-gradient-to-r from-[#081120] via-[#0f1d36] to-[#081120] border-t border-[#c5a059]/30 relative text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#e5c583] font-bold block mb-3">
            Séjour à Pointe-Noire
          </span>
          <h3 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-6">
            Réservez Votre Parenthèse d'Exception
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Transmettez vos dates en quelques clics. Notre équipe vérifie la disponibilité exacte et vous contacte pour confirmer votre séjour dans les meilleures conditions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/reservation"
              className="w-full sm:w-auto gold-gradient-bg font-bold text-xs uppercase tracking-widest px-9 py-4 rounded-lg shadow-2xl"
            >
              Faire une Demande de Réservation
            </Link>
            <a
              href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>Échanger sur WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
