import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, Clock, AlertCircle, MessageSquare, CheckCircle2 } from 'lucide-react';
import { getActiveRooms, getActiveSettings, addReservation, DATA_UPDATED_EVENT } from '../services/dataService';
import { API_BASE_URL } from '../services/apiConfig';
import type { ReservationRequest } from '../types';

export const ReservationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
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

  const initialRoomId = searchParams.get('room') || rooms[0]?.id || 'room-1';
  const initialCheckIn = searchParams.get('checkIn') || '';
  const initialCheckOut = searchParams.get('checkOut') || '';
  const initialAdults = parseInt(searchParams.get('adults') || searchParams.get('guests') || '2', 10);
  const initialChildren = parseInt(searchParams.get('children') || '0', 10);

  const [roomId, setRoomId] = useState(initialRoomId);
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [adultsCount, setAdultsCount] = useState(initialAdults);
  const [childrenCount, setChildrenCount] = useState(initialChildren);

  const [guestFullName, setGuestFullName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [submittedBooking, setSubmittedBooking] = useState<ReservationRequest | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedRoom = rooms.find(r => r.id === roomId) || rooms[0];

  // Calcul du nombre de nuits et du montant estimé
  const calculateTotals = () => {
    if (!checkInDate || !checkOutDate || !selectedRoom) return { nights: 0, totalPrice: 0 };
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const nights = diffDays > 0 ? diffDays : 0;
    const totalPrice = nights * selectedRoom.pricePerNight;
    return { nights, totalPrice };
  };

  const { nights, totalPrice } = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!checkInDate || !checkOutDate) {
      setErrorMsg('Veuillez renseigner vos dates d\'arrivée et de départ.');
      return;
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setErrorMsg('La date d\'arrivée ne peut pas être antérieure à aujourd\'hui.');
      return;
    }

    if (end <= start) {
      setErrorMsg('La date de départ doit être strictement postérieure à la date d\'arrivée.');
      return;
    }

    const totalPersons = adultsCount + childrenCount;
    const maxCapacity = (selectedRoom.capacityAdults || 2) + (selectedRoom.capacityChildren || 0);
    if (totalPersons > maxCapacity) {
      setErrorMsg(`La capacité maximale de cette chambre (${maxCapacity} personnes) est dépassée.`);
      return;
    }

    setLoading(true);

    const reference = `CNH-${Date.now().toString().slice(-6)}`;
    const newBookingData: ReservationRequest = {
      reference,
      roomId: selectedRoom.id,
      checkInDate,
      checkOutDate,
      adultsCount,
      childrenCount,
      totalNights: nights,
      totalEstimatedPrice: totalPrice,
      guestFullName,
      guestEmail,
      guestPhone,
      specialRequests,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          checkInDate,
          checkOutDate,
          adultsCount,
          childrenCount,
          guestFullName,
          guestEmail,
          guestPhone,
          specialRequests,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const savedBooking = data.reservation || newBookingData;
        addReservation(savedBooking);
        setSubmittedBooking(savedBooking);
      } else {
        const data = await res.json().catch(() => null);
        setErrorMsg(data?.error || "Votre demande n'a pas pu être transmise. Veuillez réessayer.");
      }
    } catch {
      setErrorMsg("Impossible de joindre le serveur. Votre demande n'a pas été enregistrée.");
    } finally {
      setLoading(false);
    }
  };

  // VUE DE CONFIRMATION
  if (submittedBooking) {
    return (
      <div className="bg-[#040810] text-slate-100 min-h-screen py-10 px-4">
        <div className="max-w-xl mx-auto navy-card rounded-2xl shadow-2xl p-6 sm:p-7 text-center border border-emerald-500/30">
          <div className="w-14 h-14 bg-emerald-950/70 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500/50 shadow-md shadow-emerald-950/50">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>

          <div className="inline-flex items-center space-x-2 bg-emerald-950/80 text-emerald-300 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-2.5 border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Réservation effectuée avec succès</span>
          </div>

          <h1 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
            Votre Réservation a été Enregistrée !
          </h1>

          <p className="text-slate-300 text-xs mb-4 leading-relaxed max-w-md mx-auto">
            Merci <strong className="text-white">{submittedBooking.guestFullName}</strong>, votre demande a bien été transmise à la direction de l'hôtel avec la référence :
          </p>

          <div className="bg-[#040810] border border-[#c5a059]/50 rounded-xl p-3.5 mb-5 shadow-inner">
            <span className="text-[10px] uppercase text-[#e5c583] font-bold tracking-wider block mb-0.5">
              Référence du dossier
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#fce5b5] tracking-wider">
              {submittedBooking.reference}
            </span>
          </div>

          <div className="text-left bg-[#040810]/70 rounded-xl p-4 sm:p-5 mb-5 space-y-2 text-xs border border-white/10">
            <h3 className="font-serif font-bold text-white border-b border-white/10 pb-1.5 text-xs flex items-center justify-between">
              <span>Récapitulatif de votre séjour</span>
              <span className="text-emerald-400 text-[11px] font-normal">Transmis à la réception</span>
            </h3>
            <div className="flex justify-between">
              <span className="text-slate-400">Hébergement :</span>
              <span className="font-semibold text-white">{selectedRoom?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Arrivée :</span>
              <span className="font-semibold text-white">{submittedBooking.checkInDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Départ :</span>
              <span className="font-semibold text-white">{submittedBooking.checkOutDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Voyageurs :</span>
              <span className="font-semibold text-white">
                {submittedBooking.adultsCount} adulte(s), {submittedBooking.childrenCount} enfant(s)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Contact client :</span>
              <span className="font-semibold text-white">{submittedBooking.guestPhone} ({submittedBooking.guestEmail})</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 text-xs">
              <span className="font-bold text-slate-200">Total estimé ({submittedBooking.totalNights} nuitées) :</span>
              <span className="font-serif font-bold text-[#fce5b5]">
                {submittedBooking.totalEstimatedPrice?.toLocaleString('fr-FR')} {siteSettings.currency}
              </span>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-left text-xs text-emerald-200 mb-5 space-y-1">
            <p className="font-bold text-[#e5c583] flex items-center space-x-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prochaine étape :</span>
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Notre équipe d'accueil a reçu votre dossier et va vérifier la disponibilité pour valider définitivement votre séjour. Vous serez contacté au <strong>{submittedBooking.guestPhone}</strong> ou par email.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg transition-all"
            >
              Retour à l'accueil
            </Link>
            <a
              href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}?text=Bonjour%2C%20je%20viens%20d%27effectuer%20une%20r%C3%A9servation%20avec%20succ%C3%A8s%20pour%20la%20chambre%20${encodeURIComponent(selectedRoom?.name || '')}%20(R%C3%A9f%C3%A9rence%20%3A%20${submittedBooking.reference})`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Confirmer sur WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#040810] text-slate-100 min-h-screen py-8">
      <div className="bg-gradient-to-b from-[#081120] to-[#040810] text-white py-10 px-4 mb-8 border-b border-[#c5a059]/25">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#e5c583] font-bold block mb-1.5">
            Réservation en ligne
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold mb-3">
            Formuler une Demande de Séjour
          </h1>
          <p className="max-w-xl mx-auto text-slate-300 text-xs font-light">
            Remplissez les informations de votre séjour à {siteSettings.city}. Aucun prépaiement n'est débité en ligne.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {errorMsg && (
          <div className="mb-8 p-4 bg-red-950/80 border-l-4 border-red-500 rounded-r text-red-200 text-xs flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 navy-card rounded-2xl p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-white mb-3 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-[#081120] text-[#c5a059] border border-[#c5a059]/40 text-xs flex items-center justify-center mr-2">1</span>
                  Choix de l'hébergement
                </h3>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Chambre souhaitée
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full bg-[#040810] border border-white/15 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} - {r.pricePerNight.toLocaleString('fr-FR')} {siteSettings.currency}/nuit ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="font-serif text-lg font-bold text-white mb-3 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-[#081120] text-[#c5a059] border border-[#c5a059]/40 text-xs flex items-center justify-center mr-2">2</span>
                  Dates & Nombre de voyageurs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Date d'arrivée *
                    </label>
                    <input
                      type="date"
                      required
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-[#040810] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Date de départ *
                    </label>
                    <input
                      type="date"
                      required
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-[#040810] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Adultes
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedRoom?.capacityAdults || 4}
                      value={adultsCount}
                      onChange={(e) => setAdultsCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-[#040810] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Enfants
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={selectedRoom?.capacityChildren || 2}
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-[#040810] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="font-serif text-lg font-bold text-white mb-3 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-[#081120] text-[#c5a059] border border-[#c5a059]/40 text-xs flex items-center justify-center mr-2">3</span>
                  Vos Coordonnées de contact
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Nom et Prénom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : M. Jean-Paul Mbemba"
                      value={guestFullName}
                      onChange={(e) => setGuestFullName(e.target.value)}
                      className="w-full bg-[#040810] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                        Numéro de téléphone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+242 06 000 00 00"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full bg-[#040810] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                        Adresse e-mail *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jean@exemple.cg"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full bg-[#040810] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Demandes particulières
                    </label>
                    <textarea
                      rows={3}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Heure d'arrivée estimée, transfert aéroport, etc."
                      className="w-full bg-[#040810] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient-bg font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-lg shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <span>Envoi en cours...</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-[#040810]" />
                    <span>Transmettre ma demande de réservation</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="navy-card rounded-2xl p-6 shadow-2xl sticky top-28 space-y-6">
              <h3 className="font-serif text-lg font-bold border-b border-white/10 pb-3 text-[#fce5b5]">
                Estimation de votre séjour
              </h3>

              {selectedRoom && (
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedRoom.imageUrl}
                    alt={selectedRoom.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#c5a059]/30"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white">{selectedRoom.name}</h4>
                    <span className="text-xs text-slate-400">{selectedRoom.category}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-xs border-y border-white/10 py-4">
                <div className="flex justify-between text-slate-300">
                  <span>Prix par nuit :</span>
                  <span className="font-serif font-bold text-[#fce5b5]">
                    {selectedRoom?.pricePerNight.toLocaleString('fr-FR')} {siteSettings.currency}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Nombre de nuitées :</span>
                  <span>{nights} nuit(s)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Voyageurs :</span>
                  <span>{adultsCount} adulte(s), {childrenCount} enfant(s)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Estimé :</span>
                  <span className="text-2xl font-serif font-bold text-[#fce5b5]">
                    {totalPrice > 0 ? `${totalPrice.toLocaleString('fr-FR')} ${siteSettings.currency}` : 'Sélectionnez des dates'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  * Règlement à la réception après confirmation du responsable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
