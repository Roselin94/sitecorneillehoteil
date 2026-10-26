// En local, l'API tourne sur le port 5000 ; en production, définir VITE_API_URL.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
