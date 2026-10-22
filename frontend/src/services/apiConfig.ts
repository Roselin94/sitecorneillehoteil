// URL de base de l'API : utilise la variable VITE_API_URL en production (Render/Netlify) ou localhost par défaut
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
