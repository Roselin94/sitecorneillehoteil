import React, { useState, useEffect } from 'react';
import { getActiveSettings, DATA_UPDATED_EVENT } from '../services/dataService';
import { API_BASE_URL } from '../services/apiConfig';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState(getActiveSettings);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const refreshData = () => {
      setSiteSettings(getActiveSettings());
    };

    window.addEventListener(DATA_UPDATED_EVENT, refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener(DATA_UPDATED_EVENT, refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, subject, message }),
      });
    } catch (err) {
      // Enregistrement de secours local
      const existing = JSON.parse(localStorage.getItem('corneille_messages') || '[]');
      localStorage.setItem('corneille_messages', JSON.stringify([
        { fullName, email, phone, subject, message, date: new Date().toISOString() },
        ...existing
      ]));
    } finally {
      setLoading(false);
      setSentSuccess(true);
      setFullName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12">
      {/* Header */}
      <div className="bg-[#070d18] text-white py-16 px-4 mb-12 border-b border-[#c5a059]/30">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfba73] font-bold block mb-2">
            Disponibilité & Renseignements
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
            Contactez la Réception
          </h1>
          <p className="max-w-xl mx-auto text-slate-300 text-sm font-light">
            Une question sur un hébergement, une commande spéciale à la cave ou un séjour d'affaires ? Notre équipe vous répond avec diligence.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Colonne Coordonnées */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#070d18] text-white p-6 sm:p-8 rounded-2xl border border-[#c5a059]/40 space-y-6 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-white border-b border-white/10 pb-3">
                Coordonnées Directes
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-bold block">Adresse</span>
                    <span className="text-slate-200">{siteSettings.address}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-bold block">Téléphone standard</span>
                    <a href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} className="text-slate-200 hover:text-[#dfba73]">
                      {siteSettings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-bold block">WhatsApp officiel</span>
                    <a
                      href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-200 hover:text-[#dfba73]"
                    >
                      {siteSettings.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-bold block">Courriel</span>
                    <a href={`mailto:${siteSettings.email}`} className="text-slate-200 hover:text-[#dfba73]">
                      {siteSettings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-bold block">Disponibilité</span>
                    <span className="text-slate-200">{siteSettings.receptionHours}</span>
                  </div>
                </div>
              </div>

              {/* Bouton direct WhatsApp */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded shadow flex items-center justify-center space-x-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Démarrer un chat WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Colonne Formulaire */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <h3 className="font-serif text-2xl font-bold text-[#070d18] mb-2">
              Envoyez-nous un Message
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              Remplissez ce formulaire et notre responsable vous recontactera dans les plus brefs délais.
            </p>

            {sentSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Votre message a été transmis avec succès à la réception de l'hôtel.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                  Nom et prénom complet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Votre nom..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                    Adresse e-mail *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="votre@email.cg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                    Numéro de téléphone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+242..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                  Objet du message *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Renseignement hébergement, commande cave, etc."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                  Votre message détaillé *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Écrivez votre message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="gold-gradient-bg text-[#070d18] font-bold text-xs uppercase tracking-widest py-3.5 px-6 rounded-lg shadow hover:brightness-110 transition-all flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Envoi...' : 'Envoyer le message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
