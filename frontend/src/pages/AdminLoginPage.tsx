import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../services/apiConfig';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Tentative de connexion via API si disponible
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('corneille_token', data.token);
        localStorage.setItem('corneille_admin_user', JSON.stringify(data.user));
        navigate('/admin/dashboard');
        return;
      }
    } catch (err) {
      // Mode secours si le backend est encore en configuration
    }

    // Identifiants par défaut pour initialisation sécurisée
    if ((email === 'admin@corneillehotel.cg' || email === 'admin') && password === 'Corneille2026!') {
      localStorage.setItem('corneille_token', 'local_jwt_session_token_corneille');
      localStorage.setItem('corneille_admin_user', JSON.stringify({ email, role: 'ADMIN', name: 'Responsable Hôtel' }));
      navigate('/admin/dashboard');
    } else {
      setError('Identifiants incorrects. Veuillez vérifier votre adresse e-mail et votre mot de passe.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070d18] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0d1b2a] border border-[#c5a059]/40 rounded-2xl p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Corneille Hôtel"
            className="h-16 w-auto mx-auto object-contain mb-3"
          />
          <h1 className="font-serif text-2xl font-bold text-white">
            Espace Responsable
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestion des réservations, chambres, cave et messages
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-500/50 rounded text-red-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-semibold mb-1.5">
              Identifiant / E-mail
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@corneillehotel.cg"
                className="w-full bg-[#050913] border border-white/15 rounded-lg pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-semibold mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#050913] border border-white/15 rounded-lg pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient-bg text-[#070d18] font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded-lg shadow-lg hover:brightness-110 transition-all flex items-center justify-center space-x-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400">
            Identifiants provisoires d'initialisation : <br />
            <span className="text-white font-mono">admin@corneillehotel.cg</span> / <span className="text-white font-mono">Corneille2026!</span>
          </p>
        </div>
      </div>
    </div>
  );
};
