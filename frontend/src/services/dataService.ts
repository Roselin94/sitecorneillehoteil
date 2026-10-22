import type { Room, WineItem, SiteSettings } from '../types';
import { sampleRooms, sampleWines, initialSiteSettings } from '../data/initialData';

// Clés de stockage
export const ROOMS_KEY = 'corneille_rooms';
export const WINES_KEY = 'corneille_wines';
export const SETTINGS_KEY = 'corneille_settings';
export const RESERVATIONS_KEY = 'corneille_reservations';
export const MESSAGES_KEY = 'corneille_messages';

// Nom de l'événement personnalisé pour avertir tous les composants ouverts
export const DATA_UPDATED_EVENT = 'corneille_data_updated';

// Émetteur de mise à jour pour forcer le rafraîchissement immédiat de la vue
export const notifyDataUpdated = (type: 'rooms' | 'wines' | 'settings' | 'reservations' | 'all') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DATA_UPDATED_EVENT, { detail: { type } }));
  }
};

// Récupération des chambres (stockées ou initiales par défaut)
export const getActiveRooms = (): Room[] => {
  try {
    const saved = localStorage.getItem(ROOMS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Erreur lecture chambres :', e);
  }
  return sampleRooms;
};

// Sauvegarde des chambres
export const saveActiveRooms = (rooms: Room[]): void => {
  try {
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
    notifyDataUpdated('rooms');
  } catch (e) {
    console.error('Erreur enregistrement chambres :', e);
  }
};

// Récupération des vins de la cave
export const getActiveWines = (): WineItem[] => {
  try {
    const saved = localStorage.getItem(WINES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Erreur lecture vins :', e);
  }
  return sampleWines;
};

// Sauvegarde des vins
export const saveActiveWines = (wines: WineItem[]): void => {
  try {
    localStorage.setItem(WINES_KEY, JSON.stringify(wines));
    notifyDataUpdated('wines');
  } catch (e) {
    console.error('Erreur enregistrement vins :', e);
  }
};

// Récupération des coordonnées du site
export const getActiveSettings = (): SiteSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Erreur lecture coordonnées :', e);
  }
  return initialSiteSettings;
};

// Sauvegarde des paramètres du site
export const saveActiveSettings = (settings: SiteSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    notifyDataUpdated('settings');
  } catch (e) {
    console.error('Erreur enregistrement paramètres :', e);
  }
};

// Récupération des réservations
export const getActiveReservations = (): any[] => {
  try {
    const saved = localStorage.getItem(RESERVATIONS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Erreur lecture réservations :', e);
  }
  return [
    {
      reference: 'CNH-849201',
      roomId: 'room-3',
      checkInDate: '2026-11-10',
      checkOutDate: '2026-11-14',
      adultsCount: 2,
      childrenCount: 0,
      totalNights: 4,
      totalEstimatedPrice: 440000,
      guestFullName: 'Patrice Malonga',
      guestEmail: 'p.malonga@societe.cg',
      guestPhone: '+242 06 654 32 10',
      specialRequests: 'Arrivée vers 19h. Facture d\'entreprise requise.',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }
  ];
};

// Sauvegarde des réservations
export const saveActiveReservations = (reservations: any[]): void => {
  try {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
    notifyDataUpdated('reservations');
  } catch (e) {
    console.error('Erreur enregistrement réservations :', e);
  }
};

// Ajouter une nouvelle réservation
export const addReservation = (reservation: any): void => {
  try {
    const existing = getActiveReservations();
    // Éviter les doublons par référence
    const filtered = existing.filter(r => r.reference !== reservation.reference);
    const updated = [reservation, ...filtered];
    saveActiveReservations(updated);
  } catch (e) {
    console.error('Erreur ajout réservation :', e);
  }
};
