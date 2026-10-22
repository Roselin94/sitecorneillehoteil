import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReservationRequest, Room, WineItem, SiteSettings } from '../types';
import { sampleRooms } from '../data/initialData';
import {
  getActiveRooms,
  saveActiveRooms,
  getActiveWines,
  saveActiveWines,
  getActiveSettings,
  saveActiveSettings,
  getActiveReservations,
  saveActiveReservations,
  DATA_UPDATED_EVENT
} from '../services/dataService';
import {
  Calendar, Bed, Wine, MessageSquare, LogOut, Check, X, Ban,
  Plus, Trash2, Edit3, Save, MapPin, Upload
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'reservations' | 'rooms' | 'wines' | 'messages' | 'settings'>('reservations');

  // État des réservations
  const [reservations, setReservations] = useState<ReservationRequest[]>(getActiveReservations);

  // État des Chambres dynamiques
  const [rooms, setRooms] = useState<Room[]>(getActiveRooms);

  // État de la Cave dynamique
  const [wines, setWines] = useState<WineItem[]>(getActiveWines);

  // État des Paramètres du site
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getActiveSettings);

  // Messages de contact
  const [messages, setMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem('corneille_messages');
    return saved ? JSON.parse(saved) : [
      {
        fullName: 'Claire Samba',
        email: 'claire.s@mail.com',
        phone: '+242 05 123 45 67',
        subject: 'Demande de privatisation de la Cave',
        message: 'Bonjour, nous souhaiterions organiser un cocktail de 15 personnes avec dégustation de champagne fin décembre.',
        date: new Date().toISOString()
      }
    ];
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Modals d'ajout / édition
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomFormData, setRoomFormData] = useState<Partial<Room>>({
    name: '',
    category: 'Standard',
    pricePerNight: 50000,
    capacityAdults: 2,
    capacityChildren: 1,
    sizeM2: 28,
    bedType: 'Lit Queen Size',
    shortDescription: '',
    fullDescription: '',
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Climatisation', 'Wi-Fi Fibre', 'Smart TV HD', 'Coffre-fort'],
  });

  const [isWineModalOpen, setIsWineModalOpen] = useState(false);
  const [editingWineId, setEditingWineId] = useState<string | null>(null);
  const [wineFormData, setWineFormData] = useState<Partial<WineItem>>({
    name: '',
    category: 'Vin Rouge',
    origin: 'Bordeaux, France',
    year: '2018',
    price: 150000,
    description: '',
    tastingNotes: '',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('corneille_token');
    if (!token) {
      navigate('/admin/login');
    }

    const refreshAllData = () => {
      setReservations(getActiveReservations());
      setRooms(getActiveRooms());
      setWines(getActiveWines());
      setSiteSettings(getActiveSettings());
      const savedMsgs = localStorage.getItem('corneille_messages');
      if (savedMsgs) {
        try { setMessages(JSON.parse(savedMsgs)); } catch (e) {}
      }
    };

    window.addEventListener(DATA_UPDATED_EVENT, refreshAllData);
    window.addEventListener('storage', refreshAllData);

    // Essayer également de charger depuis le backend si le serveur tourne
    fetch('http://localhost:5000/api/admin/reservations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.reservations && data.reservations.length > 0) {
          // Fusionner avec le local
          const local = getActiveReservations();
          const merged = [...data.reservations];
          local.forEach((locItem: any) => {
            if (!merged.some((m: any) => m.reference === locItem.reference)) {
              merged.push(locItem);
            }
          });
          setReservations(merged);
          saveActiveReservations(merged);
        }
      })
      .catch(() => {
        // En mode local autonome, rien à faire, localStorage est déjà actif
      });

    return () => {
      window.removeEventListener(DATA_UPDATED_EVENT, refreshAllData);
      window.removeEventListener('storage', refreshAllData);
    };
  }, [navigate]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('corneille_token');
    localStorage.removeItem('corneille_admin_user');
    navigate('/admin/login');
  };

  // --- ACTIONS RÉSERVATIONS ---
  const handleUpdateStatus = (ref: string, newStatus: 'CONFIRMED' | 'REJECTED' | 'CANCELLED') => {
    const targetBooking = reservations.find(r => r.reference === ref);
    if (!targetBooking) return;

    if (newStatus === 'CONFIRMED') {
      const targetStart = new Date(targetBooking.checkInDate).getTime();
      const targetEnd = new Date(targetBooking.checkOutDate).getTime();

      const hasConflict = reservations.some(other => {
        if (other.reference === ref || other.status !== 'CONFIRMED' || other.roomId !== targetBooking.roomId) {
          return false;
        }
        const otherStart = new Date(other.checkInDate).getTime();
        const otherEnd = new Date(other.checkOutDate).getTime();
        return (targetStart < otherEnd && targetEnd > otherStart);
      });

      if (hasConflict) {
        alert("Action impossible : Une autre réservation DÉJÀ CONFIRMÉE chevauche ces dates pour cette chambre.");
        return;
      }
    }

    const updated = reservations.map(r => r.reference === ref ? { ...r, status: newStatus } : r);
    setReservations(updated);
    saveActiveReservations(updated);
    showNotification(`Réservation ${ref} : statut ${newStatus}`);
  };

  // --- ACTIONS CHAMBRES ---
  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomFormData.name || !roomFormData.pricePerNight) return;

    if (editingRoomId) {
      const updated = rooms.map(r => r.id === editingRoomId ? ({ ...r, ...roomFormData } as Room) : r);
      setRooms(updated);
      saveActiveRooms(updated);
      showNotification(`Chambre « ${roomFormData.name} » mise à jour.`);
    } else {
      const newRoom: Room = {
        id: `room-${Date.now()}`,
        slug: roomFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: roomFormData.name,
        category: roomFormData.category as any || 'Standard',
        pricePerNight: Number(roomFormData.pricePerNight),
        capacityAdults: Number(roomFormData.capacityAdults) || 2,
        capacityChildren: Number(roomFormData.capacityChildren) || 0,
        sizeM2: Number(roomFormData.sizeM2) || 25,
        bedType: roomFormData.bedType || 'Lit King Size',
        shortDescription: roomFormData.shortDescription || '',
        fullDescription: roomFormData.fullDescription || roomFormData.shortDescription || '',
        imageUrl: roomFormData.imageUrl || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
        galleryUrls: [],
        amenities: roomFormData.amenities || ['Climatisation', 'Wi-Fi'],
        isAvailable: true,
      };
      const updated = [newRoom, ...rooms];
      setRooms(updated);
      saveActiveRooms(updated);
      showNotification(`Nouvelle chambre « ${newRoom.name} » ajoutée.`);
    }

    setIsRoomModalOpen(false);
    setEditingRoomId(null);
  };

  const handleDeleteRoom = (id: string, name: string) => {
    if (confirm(`Confirmez-vous la suppression de la chambre « ${name} » ?`)) {
      const updated = rooms.filter(r => r.id !== id);
      setRooms(updated);
      saveActiveRooms(updated);
      showNotification(`Chambre « ${name} » supprimée.`);
    }
  };

  // --- ACTIONS CAVE ---
  const handleSaveWine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wineFormData.name) return;

    if (editingWineId) {
      const updated = wines.map(w => w.id === editingWineId ? ({ ...w, ...wineFormData } as WineItem) : w);
      setWines(updated);
      saveActiveWines(updated);
      showNotification(`Bouteille « ${wineFormData.name} » mise à jour.`);
    } else {
      const newWine: WineItem = {
        id: `wine-${Date.now()}`,
        name: wineFormData.name,
        category: wineFormData.category as any || 'Vin Rouge',
        origin: wineFormData.origin || 'France',
        year: wineFormData.year,
        price: Number(wineFormData.price) || 50000,
        description: wineFormData.description || '',
        tastingNotes: wineFormData.tastingNotes || '',
        imageUrl: wineFormData.imageUrl || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
      };
      const updated = [newWine, ...wines];
      setWines(updated);
      saveActiveWines(updated);
      showNotification(`Bouteille « ${newWine.name} » ajoutée à la cave.`);
    }

    setIsWineModalOpen(false);
    setEditingWineId(null);
  };

  const handleDeleteWine = (id: string, name: string) => {
    if (confirm(`Confirmez-vous le retrait de « ${name} » de la cave ?`)) {
      const updated = wines.filter(w => w.id !== id);
      setWines(updated);
      saveActiveWines(updated);
      showNotification(`Bouteille retirée.`);
    }
  };

  // --- GESTION DES UPLOADS D'IMAGES DEPUIS LE PC ---
  const handleRoomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image sélectionnée est trop volumineuse (maximum 5 Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setRoomFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        showNotification("Photo de la chambre chargée depuis votre ordinateur.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWineImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image sélectionnée est trop volumineuse (maximum 5 Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setWineFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        showNotification("Photo de la bouteille chargée depuis votre ordinateur.");
      };
      reader.readAsDataURL(file);
    }
  };

  // --- ACTIONS COORDONNÉES DU SITE ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveActiveSettings(siteSettings);
    showNotification('Coordonnées et informations du site enregistrées avec succès.');
  };

  return (
    <div className="min-h-screen bg-[#040810] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Admin */}
      <header className="bg-[#081120] border-b border-[#c5a059]/30 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3.5">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <div>
            <h1 className="font-serif text-lg font-bold text-white tracking-wider">
              CORNEILLE - Administration
            </h1>
            <span className="text-[10px] text-[#e5c583] uppercase tracking-widest block font-bold">
              Espace Direction • Pointe-Noire
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-300 hover:text-[#e5c583] underline hidden sm:inline"
          >
            Visualiser le site public
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-950/80 hover:bg-red-900 border border-red-700/50 text-red-200 text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Navigation Onglets */}
      <div className="bg-[#081120]/60 border-b border-white/10 px-6 py-2.5 flex space-x-2 overflow-x-auto text-xs font-semibold backdrop-blur-md">
        <button
          type="button"
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'reservations' ? 'gold-gradient-bg text-[#040810] font-bold shadow' : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Réservations ({reservations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'rooms' ? 'gold-gradient-bg text-[#040810] font-bold shadow' : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Gérer les Chambres ({rooms.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wines')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'wines' ? 'gold-gradient-bg text-[#040810] font-bold shadow' : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Wine className="w-4 h-4" />
          <span>Gérer la Cave ({wines.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'messages' ? 'gold-gradient-bg text-[#040810] font-bold shadow' : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Messages ({messages.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'settings' ? 'gold-gradient-bg text-[#040810] font-bold shadow' : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Coordonnées de l'Hôtel</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs px-6 py-2.5 text-center font-medium shadow-lg animate-fadeIn">
          {notification}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {/* ONGLET 1 : GESTION DES RÉSERVATIONS */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Demandes de Réservations en Ligne
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Validation manuelle stricte pour éviter tout chevauchement sur la même chambre.
                </p>
              </div>
            </div>

            <div className="navy-card rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#081120] text-[#e5c583] uppercase tracking-wider border-b border-white/10 font-bold">
                    <tr>
                      <th className="p-4">Référence</th>
                      <th className="p-4">Voyageur & Contact</th>
                      <th className="p-4">Chambre</th>
                      <th className="p-4">Dates Séjour</th>
                      <th className="p-4">Personnes</th>
                      <th className="p-4">Montant Estimé</th>
                      <th className="p-4">Statut</th>
                      <th className="p-4 text-right">Actions Manuelles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reservations.map((res) => {
                      const roomObj = rooms.find(r => r.id === res.roomId) || sampleRooms.find(r => r.id === res.roomId);
                      return (
                        <tr key={res.reference} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-white">
                            {res.reference}
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-slate-100 block">{res.guestFullName}</span>
                            <span className="text-slate-400 block">{res.guestPhone}</span>
                            <span className="text-slate-400 block">{res.guestEmail}</span>
                            {res.specialRequests && (
                              <span className="text-[11px] text-amber-300 italic block mt-1">
                                « {res.specialRequests} »
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-slate-200 font-medium">
                            {roomObj ? roomObj.name : res.roomId}
                          </td>
                          <td className="p-4">
                            <span className="text-slate-200 block">Du {res.checkInDate}</span>
                            <span className="text-slate-200 block">Au {res.checkOutDate}</span>
                            <span className="text-[#e5c583] text-[10px] font-bold">({res.totalNights} nuitées)</span>
                          </td>
                          <td className="p-4 text-slate-300">
                            {res.adultsCount} ad. / {res.childrenCount} enf.
                          </td>
                          <td className="p-4 font-serif font-bold text-[#fce5b5] text-sm">
                            {res.totalEstimatedPrice?.toLocaleString('fr-FR')} {siteSettings.currency}
                          </td>
                          <td className="p-4">
                            {res.status === 'PENDING' && (
                              <span className="bg-amber-950 text-amber-300 border border-amber-600/50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                En attente
                              </span>
                            )}
                            {res.status === 'CONFIRMED' && (
                              <span className="bg-emerald-950 text-emerald-300 border border-emerald-600/50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                Confirmée
                              </span>
                            )}
                            {res.status === 'REJECTED' && (
                              <span className="bg-rose-950 text-rose-300 border border-rose-600/50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                Refusée
                              </span>
                            )}
                            {res.status === 'CANCELLED' && (
                              <span className="bg-slate-800 text-slate-400 border border-slate-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                Annulée
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            {res.status === 'PENDING' && (
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(res.reference || '', 'CONFIRMED')}
                                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-emerald-900/50 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
                                  title="Confirmer la réservation (contrôle des doublons automatique)"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Confirmer</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(res.reference || '', 'REJECTED')}
                                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold text-xs bg-rose-700 hover:bg-rose-600 text-white shadow-md hover:shadow-rose-950/50 active:scale-95 transition-all cursor-pointer border border-rose-500/40"
                                  title="Refuser la demande"
                                >
                                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Refuser</span>
                                </button>
                              </div>
                            )}
                            {res.status === 'CONFIRMED' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(res.reference || '', 'CANCELLED')}
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 shadow active:scale-95 transition-all cursor-pointer"
                                title="Annuler cette réservation"
                              >
                                <Ban className="w-3.5 h-3.5 text-slate-400" />
                                <span>Annuler</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 2 : GESTION DES CHAMBRES (AJOUT & MODIFICATION) */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Gestion des Chambres & Tarifs ({siteSettings.currency})
                </h2>
                <p className="text-xs text-slate-400">
                  Ajoutez, modifiez ou supprimez des hébergements et ajustez les prix par nuitée.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingRoomId(null);
                  setRoomFormData({
                    name: '',
                    category: 'Standard',
                    pricePerNight: 50000,
                    capacityAdults: 2,
                    capacityChildren: 1,
                    sizeM2: 28,
                    bedType: 'Lit Queen Size',
                    shortDescription: '',
                    fullDescription: '',
                    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
                    amenities: ['Climatisation', 'Wi-Fi Fibre', 'Smart TV HD', 'Coffre-fort'],
                  });
                  setIsRoomModalOpen(true);
                }}
                className="gold-gradient-bg font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center space-x-2 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#040810]" />
                <span>Ajouter une Chambre</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className="navy-card rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex space-x-4 mb-4">
                      <img src={room.imageUrl} alt="" className="w-28 h-28 rounded-xl object-cover border border-[#c5a059]/30" />
                      <div className="flex-1">
                        <span className="text-[10px] uppercase tracking-wider text-[#e5c583] font-bold block">
                          {room.category}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-white">{room.name}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">{room.shortDescription}</p>
                      </div>
                    </div>

                    <div className="bg-[#040810]/70 p-3 rounded-xl border border-white/5 space-y-1 text-xs text-slate-300 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tarif par nuitée :</span>
                        <span className="font-serif font-bold text-[#fce5b5]">
                          {room.pricePerNight.toLocaleString('fr-FR')} {siteSettings.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Capacité :</span>
                        <span>{room.capacityAdults} adultes • {room.capacityChildren} enfant(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Surface & Lit :</span>
                        <span>{room.sizeM2} m² • {room.bedType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRoomId(room.id);
                        setRoomFormData(room);
                        setIsRoomModalOpen(true);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRoom(room.id, room.name)}
                      className="bg-rose-950/80 hover:bg-rose-900 border border-rose-700/50 text-rose-200 px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET 3 : GESTION DE LA CAVE */}
        {activeTab === 'wines' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Gestion de la Cave à Vins & Spiritueux
                </h2>
                <p className="text-xs text-slate-400">
                  Gérez la collection de grands crus, les millésimes, les prix et les notes de dégustation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingWineId(null);
                  setWineFormData({
                    name: '',
                    category: 'Vin Rouge',
                    origin: 'Bordeaux, France',
                    year: '2019',
                    price: 150000,
                    description: '',
                    tastingNotes: '',
                    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                  });
                  setIsWineModalOpen(true);
                }}
                className="gold-gradient-bg font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center space-x-2 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#040810]" />
                <span>Ajouter un Flacon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wines.map((wine) => (
                <div key={wine.id} className="navy-card rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="h-40 rounded-xl overflow-hidden mb-3 bg-black/40">
                      <img src={wine.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] uppercase text-[#e5c583] font-bold">{wine.category}</span>
                    <h4 className="font-serif text-base font-bold text-white mb-1">{wine.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-2 italic">« {wine.tastingNotes} »</p>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                    <span className="text-[#fce5b5] font-serif font-bold text-sm">
                      {wine.price ? `${wine.price.toLocaleString('fr-FR')} ${siteSettings.currency}` : 'Sur demande'}
                    </span>
                    <div className="flex space-x-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingWineId(wine.id);
                          setWineFormData(wine);
                          setIsWineModalOpen(true);
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-md cursor-pointer"
                        title="Modifier"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteWine(wine.id, wine.name)}
                        className="bg-rose-950 hover:bg-rose-900 text-rose-200 p-1.5 rounded-md cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET 4 : MESSAGES REÇUS */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white">
              Messages Reçus depuis le Formulaire Contact
            </h2>
            <div className="space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className="navy-card rounded-2xl p-5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{m.fullName}</h4>
                      <span className="text-xs text-slate-400">{m.email} • {m.phone}</span>
                    </div>
                    <span className="text-[10px] text-[#e5c583]">{new Date(m.date).toLocaleString('fr-FR')}</span>
                  </div>
                  <div className="bg-[#040810]/70 p-4 rounded-xl border border-white/5 text-xs text-slate-300">
                    <strong className="text-[#fce5b5] block mb-1">Objet : {m.subject}</strong>
                    <p>{m.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET 5 : COORDONNÉES ET PARAMÈTRES DU SITE */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">
                Coordonnées & Paramètres Officiels de l'Établissement
              </h2>
              <p className="text-xs text-slate-400">
                Mettez à jour les adresses, téléphones, numéro WhatsApp et horaires affichés sur l'ensemble du site.
              </p>
            </div>

            <div className="navy-card rounded-2xl p-6 sm:p-8 max-w-3xl">
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#e5c583] font-bold mb-1.5">
                      Nom de l'établissement
                    </label>
                    <input
                      type="text"
                      value={siteSettings.name}
                      onChange={(e) => setSiteSettings({ ...siteSettings, name: e.target.value })}
                      className="w-full bg-[#040810] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#e5c583] font-bold mb-1.5">
                      Ville & Pays
                    </label>
                    <input
                      type="text"
                      value={`${siteSettings.city}, ${siteSettings.country}`}
                      disabled
                      className="w-full bg-[#040810]/50 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#e5c583] font-bold mb-1.5">
                    Adresse physique à Pointe-Noire
                  </label>
                  <input
                    type="text"
                    value={siteSettings.address}
                    onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                    className="w-full bg-[#040810] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#e5c583] font-bold mb-1.5">
                      Téléphone Réception
                    </label>
                    <input
                      type="text"
                      value={siteSettings.phone}
                      onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                      className="w-full bg-[#040810] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#e5c583] font-bold mb-1.5">
                      Numéro WhatsApp Officiel
                    </label>
                    <input
                      type="text"
                      value={siteSettings.whatsapp}
                      onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
                      className="w-full bg-[#040810] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#e5c583] font-bold mb-1.5">
                      E-mail de contact
                    </label>
                    <input
                      type="email"
                      value={siteSettings.email}
                      onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                      className="w-full bg-[#040810] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#e5c583] font-bold mb-1.5">
                      Disponibilité Réception
                    </label>
                    <input
                      type="text"
                      value={siteSettings.receptionHours}
                      onChange={(e) => setSiteSettings({ ...siteSettings, receptionHours: e.target.value })}
                      className="w-full bg-[#040810] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    className="gold-gradient-bg font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-lg flex items-center space-x-2 shadow cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-[#040810]" />
                    <span>Enregistrer les coordonnées</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* MODAL AJOUT / ÉDITION CHAMBRE */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#081120] border border-[#c5a059]/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-white">
              {editingRoomId ? 'Modifier la chambre' : 'Ajouter une nouvelle chambre'}
            </h3>
            <form onSubmit={handleSaveRoom} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nom de la chambre *</label>
                <input
                  type="text"
                  required
                  value={roomFormData.name}
                  onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })}
                  placeholder="Ex : Chambre Royale Supérieure"
                  className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Catégorie</label>
                  <select
                    value={roomFormData.category}
                    onChange={(e) => setRoomFormData({ ...roomFormData, category: e.target.value as any })}
                    className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Supérieure">Supérieure</option>
                    <option value="Suite Deluxe">Suite Deluxe</option>
                    <option value="Suite Exécutive">Suite Exécutive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tarif / nuit (XAF) *</label>
                  <input
                    type="number"
                    required
                    value={roomFormData.pricePerNight}
                    onChange={(e) => setRoomFormData({ ...roomFormData, pricePerNight: Number(e.target.value) })}
                    className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Capacité Adultes</label>
                  <input
                    type="number"
                    min="1"
                    value={roomFormData.capacityAdults}
                    onChange={(e) => setRoomFormData({ ...roomFormData, capacityAdults: Number(e.target.value) })}
                    className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Enfants</label>
                  <input
                    type="number"
                    min="0"
                    value={roomFormData.capacityChildren}
                    onChange={(e) => setRoomFormData({ ...roomFormData, capacityChildren: Number(e.target.value) })}
                    className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Surface (m²)</label>
                  <input
                    type="number"
                    value={roomFormData.sizeM2}
                    onChange={(e) => setRoomFormData({ ...roomFormData, sizeM2: Number(e.target.value) })}
                    className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Type de lit</label>
                <input
                  type="text"
                  value={roomFormData.bedType}
                  onChange={(e) => setRoomFormData({ ...roomFormData, bedType: e.target.value })}
                  placeholder="Lit King Size (180x200)"
                  className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description courte</label>
                <textarea
                  rows={2}
                  value={roomFormData.shortDescription}
                  onChange={(e) => setRoomFormData({ ...roomFormData, shortDescription: e.target.value })}
                  placeholder="Quelques lignes résumant l'ambiance et les atouts..."
                  className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              {/* UPLOAD PHOTO CHAMBRE DEPUIS LE PC */}
              <div className="space-y-2 pt-1 border-t border-white/10">
                <label className="block text-slate-300 font-semibold">
                  Photo principale de la chambre *
                </label>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  {roomFormData.imageUrl && (
                    <div className="w-24 h-20 rounded-xl overflow-hidden border border-[#c5a059]/40 bg-black shrink-0 relative group">
                      <img src={roomFormData.imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white transition-opacity">
                        Aperçu
                      </div>
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <label className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-[#0f1d36] hover:bg-[#152a4e] border border-[#c5a059]/40 rounded-xl cursor-pointer text-[#e5c583] hover:text-white transition-all shadow-md">
                      <Upload className="w-4 h-4" />
                      <span className="font-bold text-xs">Uploader une image depuis ce PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleRoomImageUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      placeholder="Ou collez un lien d'image web..."
                      value={roomFormData.imageUrl}
                      onChange={(e) => setRoomFormData({ ...roomFormData, imageUrl: e.target.value })}
                      className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-1.5 text-slate-300 text-[11px] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="gold-gradient-bg font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AJOUT / ÉDITION CAVE */}
      {isWineModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#081120] border border-[#c5a059]/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-white">
              {editingWineId ? 'Modifier le flacon' : 'Ajouter une bouteille à la cave'}
            </h3>
            <form onSubmit={handleSaveWine} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nom du vin / champagne / spiritueux *</label>
                <input
                  type="text"
                  required
                  value={wineFormData.name}
                  onChange={(e) => setWineFormData({ ...wineFormData, name: e.target.value })}
                  placeholder="Ex : Château Haut-Brion Premier Grand Cru"
                  className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Catégorie</label>
                  <select
                    value={wineFormData.category}
                    onChange={(e) => setWineFormData({ ...wineFormData, category: e.target.value as any })}
                    className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Vin Rouge">Vin Rouge</option>
                    <option value="Vin Blanc">Vin Blanc</option>
                    <option value="Champagne">Champagne</option>
                    <option value="Spiritueux">Spiritueux</option>
                    <option value="Rosé">Rosé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tarif (XAF)</label>
                  <input
                    type="number"
                    value={wineFormData.price || ''}
                    onChange={(e) => setWineFormData({ ...wineFormData, price: Number(e.target.value) })}
                    placeholder="Laissez vide si sur demande"
                    className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Origine / Terroir</label>
                  <input
                    type="text"
                    value={wineFormData.origin}
                    onChange={(e) => setWineFormData({ ...wineFormData, origin: e.target.value })}
                    placeholder="Bordeaux, Bourgogne, Épernay..."
                    className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Millésime</label>
                  <input
                    type="text"
                    value={wineFormData.year || ''}
                    onChange={(e) => setWineFormData({ ...wineFormData, year: e.target.value })}
                    placeholder="Ex : 2018"
                    className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes de dégustation</label>
                <textarea
                  rows={2}
                  value={wineFormData.tastingNotes}
                  onChange={(e) => setWineFormData({ ...wineFormData, tastingNotes: e.target.value })}
                  placeholder="Notes aromatiques, tanins, finale..."
                  className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              {/* UPLOAD PHOTO BOUTEILLE DEPUIS LE PC */}
              <div className="space-y-2 pt-1 border-t border-white/10">
                <label className="block text-slate-300 font-semibold">
                  Photo du flacon / bouteille *
                </label>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  {wineFormData.imageUrl && (
                    <div className="w-20 h-24 rounded-xl overflow-hidden border border-[#c5a059]/40 bg-black shrink-0 relative group">
                      <img src={wineFormData.imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white transition-opacity">
                        Aperçu
                      </div>
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <label className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-[#0f1d36] hover:bg-[#152a4e] border border-[#c5a059]/40 rounded-xl cursor-pointer text-[#e5c583] hover:text-white transition-all shadow-md">
                      <Upload className="w-4 h-4" />
                      <span className="font-bold text-xs">Uploader la photo depuis ce PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleWineImageUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      placeholder="Ou collez un lien d'image web..."
                      value={wineFormData.imageUrl}
                      onChange={(e) => setWineFormData({ ...wineFormData, imageUrl: e.target.value })}
                      className="w-full bg-[#040810] border border-white/15 rounded-lg px-3 py-1.5 text-slate-300 text-[11px] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsWineModalOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="gold-gradient-bg font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
