# Déploiement sur Railway

Le dépôt contient deux services indépendants. Déployez-les depuis le même dépôt GitHub en créant deux services Railway.

## 1. API

- Créez un service depuis le dépôt GitHub et définissez son **Root Directory** sur `/backend`.
- Le fichier `backend/railway.json` configure la compilation, le démarrage et le contrôle de santé.
- Dans **Variables**, définissez `JWT_SECRET`, `ADMIN_EMAIL` et `ADMIN_PASSWORD`.
  - `JWT_SECRET` doit contenir au moins 32 caractères aléatoires.
  - `ADMIN_PASSWORD` doit contenir au moins 12 caractères.
  - Pour générer un secret localement avec Node.js : `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`.
- Générez un domaine public Railway pour l'API. Sa route de contrôle de santé est `/api/health`.

## 2. Site web

- Créez un second service depuis le même dépôt et définissez son **Root Directory** sur `/frontend`.
- Dans ses variables, définissez `VITE_API_URL` avec l'URL publique complète de l'API, par exemple `https://votre-api.up.railway.app`, sans `/` final.
- Redéployez le frontend après avoir défini `VITE_API_URL` : Vite intègre cette variable lors de la compilation.
- Le service sert le dossier `dist` et écoute sur le port `PORT` fourni par Railway.

## 3. Base de données et limites actuelles

Le schéma Prisma décrit une base MySQL, mais les routes actuelles de l'API n'utilisent pas encore Prisma : réservations et messages sont conservés en mémoire et disparaissent lors d'un redémarrage ou d'un nouveau déploiement. Les chambres, vins et paramètres du site sont conservés dans le `localStorage` du navigateur. Ajouter MySQL sur Railway ne rendra donc pas ces données persistantes à ce stade.

N'utilisez pas ce déploiement pour traiter de vraies réservations ou des données client avant d'avoir relié les routes et l'administration à une base persistante. Les migrations Prisma ne sont pas encore configurées.

## 4. Vérification

- Ouvrez `https://votre-api.up.railway.app/api/health` et vérifiez la réponse JSON avec `"status": "online"`.
- Ouvrez le domaine public du frontend et testez la connexion administrateur et les formulaires après configuration des variables.
- Ne placez jamais de secrets dans le dépôt ou dans les variables `VITE_*` : celles-ci sont intégrées au code public du frontend.
