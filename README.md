# CORNEILLE HÔTEL & CAVE - POINTE-NOIRE (RÉPUBLIQUE DU CONGO)

Site web officiel, dynamique, professionnel et responsive développé pour **CORNEILLE HÔTEL & CAVE**, situé à Pointe-Noire, République du Congo.

---

## 🏛️ Identité & Caractéristiques
- **Établissement** : CORNEILLE HÔTEL & CAVE
- **Ville / Pays** : Pointe-Noire, République du Congo
- **Devise** : Francs CFA (XAF)
- **Fuseau horaire** : `Africa/Brazzaville` (GMT+1)
- **Charte Graphique** : Blanc pur, Bleu Nuit (`#070D18`, `#0D1B2A`), Doré prestige (`#C5A059`, `#DFBA73`)
- **Typographies** : Cinzel (Titres & Prestige) & Plus Jakarta Sans (Corps & Confort de lecture)
- **Logo** : `logo.png` intégré à la racine du projet

---

## 🛠️ Stack Technique
- **Frontend** : React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, React Router DOM
- **Backend** : Node.js, Express, TypeScript, Zod, JWT, Bcrypt
- **Base de données & ORM** : MySQL avec schéma Prisma complet (`schema.prisma`)
- **API** : RESTful avec validation stricte, calcul automatique des nuitées et détection des conflits de dates

---

## 📄 Pages Incluses
1. **Accueil (`/`)** : Hero section immersive, sélecteur rapide de dates, atouts, chambres vedettes, aperçu de la Cave et bouton Réserver.
2. **Chambres (`/chambres`)** : Catalogue des chambres et suites avec filtrage par catégorie, capacités, superficies et tarifs en XAF.
3. **Détail d'une chambre (`/chambres/:slug`)** : Galerie interactive, caractéristiques complètes, équipements et module direct de réservation.
4. **La Cave (`/la-cave`)** : Sélection de vins de garde, champagnes et spiritueux d'exception, notes de dégustation et commande directe.
5. **Galerie (`/galerie`)** : Immersion visuelle plein écran avec filtres (Hôtel, Chambres, Cave, Lounge).
6. **À Propos (`/a-propos`)** : Histoire, piliers d'excellence hôtelière et situation géographique à Pointe-Noire.
7. **Contact (`/contact`)** : Téléphone, lien direct WhatsApp, localisation, horaires 24h/24 et formulaire de contact.
8. **FAQ & Conditions (`/faq`)** : Accordéon des questions fréquentes et politique de séjour/annulation.
9. **Connexion Responsable (`/admin/login`)** : Authentification protégée par jeton JWT.
10. **Tableau de bord Admin (`/admin/dashboard`)** :
    - Gestion des réservations avec confirmation ou refus manuel.
    - **Système anti-doublon** : blocage automatique de confirmation en cas de chevauchement de dates sur une même chambre (Code HTTP 409).
    - Consultation des chambres, des vins et des messages reçus.

---

## 🚀 Guide de Démarrage sous Windows PowerShell

### 1. Démarrage du Backend (Port 5000)
Ouvrez une fenêtre PowerShell dans le dossier `backend` :
```powershell
cd "c:\Users\SNIPER\Desktop\Site Corneille Hotel\backend"
node dist/index.js
```
*Pour relancer en mode développement avec rechargement automatique :*
```powershell
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
```

### 2. Démarrage du Frontend (Port 5173)
Dans une seconde fenêtre PowerShell dans le dossier `frontend` :
```powershell
cd "c:\Users\SNIPER\Desktop\Site Corneille Hotel\frontend"
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
```
Accédez au site dans votre navigateur : **`http://localhost:5173`**

---

## 🔐 Configuration de l'Administration

Aucun identifiant administrateur par défaut n'est fourni. Configurez `ADMIN_EMAIL`, `ADMIN_PASSWORD` (12 caractères minimum) et `JWT_SECRET` (32 caractères minimum) dans les variables d'environnement du backend. Pour un lancement local, copiez `backend/.env.example` vers `backend/.env` et remplacez les valeurs d'exemple par des secrets personnels.

---

## 🗄️ Configuration MySQL (WAMP / MariaDB / MySQL Server)
Le fichier [schema.prisma](file:///c:/Users/SNIPER/Desktop/Site%20Corneille%20Hotel/backend/prisma/schema.prisma) est configuré pour MySQL.
Dans le fichier `backend/.env` :
```env
DATABASE_URL="mysql://root:@localhost:3306/corneille_hotel_db"
```
Une fois le service MySQL de Wamp (`wampmysqld64`) démarré, appliquez les migrations Prisma :
```powershell
cd "c:\Users\SNIPER\Desktop\Site Corneille Hotel\backend"
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run prisma:migrate
```

---

## 🛡️ Sécurité & Workflow de Réservation
1. **Aucun paiement en ligne direct** : toute demande reste **« En attente de confirmation »** avec une référence unique (ex: `CNH-765161`).
2. Le responsable de l'hôtel contrôle la conformité des dates et appelle le client pour valider.
3. Le système vérifie côté serveur et refuse toute tentative de double réservation lors de la confirmation manuelle.

---

## 🚂 Déploiement sur Railway

Le dépôt est préparé pour Railway avec deux services (frontend et API). Consultez le [guide de déploiement Railway](./RAILWAY.md) pour configurer les répertoires racines, les variables d'environnement et les contrôles de santé.

**Important :** les routes de réservation et de contact utilisent actuellement la mémoire du serveur, et les données du site sont conservées dans le navigateur. Elles ne sont pas encore persistées dans MySQL ; consultez les limites et précautions du guide avant toute mise en production.
