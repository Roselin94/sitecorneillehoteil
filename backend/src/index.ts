import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET doit être défini et contenir au moins 32 caractères.');
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
  throw new Error('ADMIN_EMAIL et ADMIN_PASSWORD (12 caractères minimum) doivent être définis.');
}

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Stockage mémoire réactif / cache avec persistance synchrone pour tolérance maximale
let mockReservations: any[] = [
  {
    id: 'res-1',
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

let mockMessages: any[] = [
  {
    id: 'msg-1',
    fullName: 'Claire Samba',
    email: 'claire.s@mail.com',
    phone: '+242 05 123 45 67',
    subject: 'Demande de privatisation de la Cave',
    message: 'Bonjour, nous souhaiterions organiser une dégustation de champagne fin décembre pour 15 personnes.',
    isRead: false,
    createdAt: new Date().toISOString(),
  }
];

// Middleware d'authentification JWT
const authenticateAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Accès non autorisé : Token manquant' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide ou expiré' });
    return;
  }
};

// --- ROUTES AUTHENTIFICATION ---
app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email, role: 'ADMIN', name: 'Responsable Corneille Hôtel & Cave' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: { email, role: 'ADMIN', name: 'Responsable Corneille Hôtel & Cave' }
    });
    return;
  }

  res.status(401).json({ error: 'Identifiants invalides' });
});

// --- ROUTES RÉSERVATIONS PUBLIQUES & VALIDATION ---
const reservationSchema = z.object({
  roomId: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  adultsCount: z.number().min(1),
  childrenCount: z.number().min(0),
  guestFullName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(6),
  specialRequests: z.string().optional(),
});

// Créer une demande de réservation (Statut automatique : PENDING)
app.post('/api/reservations', (req: Request, res: Response): void => {
  try {
    const validatedData = reservationSchema.parse(req.body);

    const start = new Date(validatedData.checkInDate);
    const end = new Date(validatedData.checkOutDate);

    if (end <= start) {
      res.status(400).json({ error: 'La date de départ doit être strictement postérieure à l\'arrivée.' });
      return;
    }

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalNights = diffDays > 0 ? diffDays : 1;

    // Récupération prix de référence
    const prices: Record<string, number> = {
      'room-1': 45000,
      'room-2': 65000,
      'room-3': 110000,
      'room-4': 145000,
    };
    const roomPrice = prices[validatedData.roomId] || 50000;
    const totalEstimatedPrice = totalNights * roomPrice;

    // Génération de référence unique
    const reference = `CNH-${Math.floor(100000 + Math.random() * 900000)}`;

    const newReservation = {
      id: `res-${Date.now()}`,
      reference,
      ...validatedData,
      totalNights,
      totalEstimatedPrice,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    mockReservations.unshift(newReservation);

    res.status(201).json({
      message: 'Demande de réservation enregistrée en attente de validation',
      reservation: newReservation,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Données invalides' });
  }
});

// --- ROUTES ADMIN POUR LES RÉSERVATIONS ---
// Liste complète des réservations
app.get('/api/admin/reservations', authenticateAdmin, (req: Request, res: Response): void => {
  res.json({ reservations: mockReservations });
});

// Modification de statut avec contrôle strict d'absence de doublon
app.patch('/api/admin/reservations/:reference/status', authenticateAdmin, (req: Request, res: Response): void => {
  const { reference } = req.params;
  const { status, rejectionReason } = req.body;

  if (!['CONFIRMED', 'REJECTED', 'CANCELLED'].includes(status)) {
    res.status(400).json({ error: 'Statut invalide' });
    return;
  }

  const booking = mockReservations.find(r => r.reference === reference);
  if (!booking) {
    res.status(404).json({ error: 'Réservation non trouvée' });
    return;
  }

  // Prévention des doubles réservations lors de la confirmation
  if (status === 'CONFIRMED') {
    const targetStart = new Date(booking.checkInDate).getTime();
    const targetEnd = new Date(booking.checkOutDate).getTime();

    const hasConflict = mockReservations.some(other => {
      if (other.reference === reference || other.status !== 'CONFIRMED' || other.roomId !== booking.roomId) {
        return false;
      }
      const otherStart = new Date(other.checkInDate).getTime();
      const otherEnd = new Date(other.checkOutDate).getTime();
      return (targetStart < otherEnd && targetEnd > otherStart);
    });

    if (hasConflict) {
      res.status(409).json({
        error: 'Conflit de calendrier : Une autre réservation déjà confirmée chevauche ces dates pour cette même chambre.'
      });
      return;
    }
  }

  booking.status = status;
  if (status === 'CONFIRMED') {
    booking.confirmedAt = new Date().toISOString();
  }
  if (rejectionReason) {
    booking.rejectionReason = rejectionReason;
  }

  res.json({ message: `Réservation ${reference} mise à jour avec succès`, reservation: booking });
});

// --- MESSAGES DE CONTACT ---
app.post('/api/contact', (req: Request, res: Response): void => {
  const { fullName, email, phone, subject, message } = req.body;
  if (!fullName || !email || !message) {
    res.status(400).json({ error: 'Champs obligatoires manquants' });
    return;
  }

  const newMessage = {
    id: `msg-${Date.now()}`,
    fullName,
    email,
    phone,
    subject: subject || 'Sans objet',
    message,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  mockMessages.unshift(newMessage);
  res.status(201).json({ message: 'Message transmis avec succès', data: newMessage });
});

app.get('/api/admin/messages', authenticateAdmin, (req: Request, res: Response): void => {
  res.json({ messages: mockMessages });
});

// Statut de santé
app.get('/api/health', (req: Request, res: Response): void => {
  res.json({
    status: 'online',
    establishment: 'CORNEILLE HÔTEL & CAVE',
    city: 'Pointe-Noire',
    country: 'République du Congo',
    currency: 'XAF',
    timezone: 'Africa/Brazzaville',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Serveur CORNEILLE HOTEL & CAVE actif sur http://localhost:${PORT}`);
});
