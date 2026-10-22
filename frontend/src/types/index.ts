export interface Room {
  id: string;
  name: string;
  slug: string;
  category: 'Standard' | 'Supérieure' | 'Suite Deluxe' | 'Suite Exécutive';
  pricePerNight: number; // en FCFA (XAF)
  capacityAdults: number;
  capacityChildren: number;
  sizeM2: number;
  bedType: string;
  shortDescription: string;
  fullDescription: string;
  amenities: string[];
  imageUrl: string;
  galleryUrls: string[];
  isAvailable: boolean;
  featured?: boolean;
}

export interface WineItem {
  id: string;
  name: string;
  category: 'Vin Rouge' | 'Vin Blanc' | 'Champagne' | 'Spiritueux' | 'Rosé';
  origin: string;
  year?: string;
  price?: number; // FCFA
  description: string;
  tastingNotes: string;
  imageUrl: string;
  isAvailable: boolean;
}

export interface ReservationRequest {
  id?: string;
  reference?: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  adultsCount: number;
  childrenCount: number;
  totalNights?: number;
  totalEstimatedPrice?: number;
  guestFullName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
  createdAt?: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  phoneSecondary?: string;
  whatsapp: string;
  email: string;
  receptionHours: string;
  currency: string;
  timezone: string;
}
