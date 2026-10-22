import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Calendar, ShieldCheck } from 'lucide-react';
import { getActiveRooms, getActiveSettings, DATA_UPDATED_EVENT } from '../services/dataService';

export const RoomDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

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

  const room = rooms.find(r => r.slug === slug) || rooms[0];
  const [selectedImage, setSelectedImage] = useState<string>(room?.imageUrl || '');

  useEffect(() => {
    if (room) {
      setSelectedImage(room.imageUrl);
    }
  }, [room]);

  // Formulaire rapide intégré sur la page de détail
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');

  const handleStartBooking = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/reservation?room=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`);
  };

  return (
    <div className="bg-[#040810] text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fil d'Ariane & Retour */}
        <div className="mb-6">
          <Link to="/chambres" className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-[#e5c583] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Retour à toutes les chambres
          </Link>
        </div>

        {/* Titre & Catégorie */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#e5c583] font-bold block mb-1">
              Catégorie {room.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              {room.name}
            </h1>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#fce5b5] block">
              {room.pricePerNight.toLocaleString('fr-FR')} {siteSettings.currency}
            </span>
            <span className="text-xs text-slate-400">par nuitée • petit-déjeuner sur demande</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Colonne Gauche : Galerie Photos & Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Grande image principale */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#c5a059]/30 h-80 sm:h-[450px] relative bg-black/60">
              <img
                src={selectedImage}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Miniatures de galerie */}
            {room.galleryUrls && room.galleryUrls.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                <button
                  type="button"
                  onClick={() => setSelectedImage(room.imageUrl)}
                  className={`relative w-24 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === room.imageUrl ? 'border-[#c5a059] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={room.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
                {room.galleryUrls.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(url)}
                    className={`relative w-24 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === url ? 'border-[#c5a059] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Caractéristiques Clés */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 navy-card p-5 rounded-2xl">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Superficie</span>
                <span className="text-sm font-bold text-white">{room.sizeM2} m²</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Capacité</span>
                <span className="text-sm font-bold text-white">{room.capacityAdults} Adultes, {room.capacityChildren} Enfant</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Type de lit</span>
                <span className="text-sm font-bold text-white">{room.bedType}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Disponibilité</span>
                <span className="text-sm font-bold text-emerald-400">Sur demande</span>
              </div>
            </div>

            {/* Description Détaillée */}
            <div className="navy-card p-8 rounded-2xl space-y-4">
              <h2 className="font-serif text-xl font-bold text-white">
                À propos de cette chambre
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                {room.fullDescription || room.shortDescription}
              </p>
            </div>

            {/* Équipements inclus */}
            {room.amenities && room.amenities.length > 0 && (
              <div className="navy-card p-8 rounded-2xl space-y-4">
                <h2 className="font-serif text-xl font-bold text-white">
                  Équipements & Prestations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {room.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#c5a059] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne Droite : Formulaire d'engagement de réservation */}
          <div className="lg:col-span-1">
            <div className="navy-card p-6 sm:p-8 rounded-2xl shadow-2xl sticky top-28">
              <div className="border-b border-white/10 pb-4 mb-6">
                <span className="text-[10px] uppercase tracking-widest text-[#e5c583] font-bold block mb-1">
                  Séjour à {siteSettings.city}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Réserver cet hébergement
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Validation manuelle requise par la direction.
                </p>
              </div>

              <form onSubmit={handleStartBooking} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                    Date d'arrivée
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-[#040810] border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                    Date de départ
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-[#040810] border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                      Adultes
                    </label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(e.target.value)}
                      className="w-full bg-[#040810] border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                    >
                      <option value="1">1 Adulte</option>
                      <option value="2">2 Adultes</option>
                      <option value="3">3 Adultes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                      Enfants
                    </label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(e.target.value)}
                      className="w-full bg-[#040810] border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                    >
                      <option value="0">0 Enfant</option>
                      <option value="1">1 Enfant</option>
                      <option value="2">2 Enfants</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Tarif par nuitée</span>
                    <span className="font-bold text-[#fce5b5]">{room.pricePerNight.toLocaleString('fr-FR')} {siteSettings.currency}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Conditions d'annulation</span>
                    <span className="text-[#e5c583]">Flexibles selon validation</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full gold-gradient-bg font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 mt-4 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#040810]" />
                  <span>Continuer la réservation</span>
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400 flex items-center justify-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                <span>Aucun paiement en ligne direct</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
