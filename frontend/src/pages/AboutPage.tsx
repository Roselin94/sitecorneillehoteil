import React from 'react';
import { ShieldCheck, Award, Sparkles, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen py-12">
      {/* Header */}
      <div className="bg-[#070d18] text-white py-20 px-4 mb-12 border-b border-[#c5a059]/30">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfba73] font-bold block mb-2">
            Notre Histoire & Nos Valeurs
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
            À Propos de Corneille Hôtel & Cave
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base font-light">
            Une vision exigeante de l'hôtellerie conjuguée au plaisir des grands terroirs viticoles à Pointe-Noire.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Histoire & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#9e7d3b] font-bold block">
              Une adresse singulière
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#070d18]">
              L'Hospitalité Raffinée au Cœur du Congo
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Fondé avec la volonté d'offrir une étape feutrée et mémorable aux visiteurs de passage comme aux résidents de Pointe-Noire, <strong>CORNEILLE HÔTEL & CAVE</strong> se distingue par son atmosphère intimiste et son souci permanent de la qualité.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Ici, chaque détail a été pensé pour créer un équilibre harmonieux entre fonctionnalité moderne, confort de repos supérieur et art de vivre gastronomique grâce à notre cave à vins intégrée.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 h-80 bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
              alt="Hôtel Corneille"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Nos Piliers d'Excellence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 gold-gradient-bg text-[#070d18] rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#070d18] mb-2">Discrétion & Sécurité</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Un accueil discret et sécurisé 24h/24 garantissant la quiétude indispensable à vos séjours privés et professionnels.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 gold-gradient-bg text-[#070d18] rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#070d18] mb-2">Prestations Sur-Mesure</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chaque réservation est étudiée et confirmée manuellement par la direction pour adapter l'accueil à vos attentes exactes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 gold-gradient-bg text-[#070d18] rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#070d18] mb-2">L'Expérience de la Cave</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Une sélection œnologique rare à Pointe-Noire, réunissant des crus conservés dans des conditions de fraîcheur optimales.
            </p>
          </div>
        </div>

        {/* Ancrage local */}
        <div className="bg-[#070d18] text-white p-8 sm:p-10 rounded-2xl border border-[#c5a059]/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-[#dfba73] text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4 text-[#c5a059]" />
              <span>Situation géographique privilégiée</span>
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">Au Cœur de Pointe-Noire</h3>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Idéalement implanté à Pointe-Noire, notre établissement facilite vos déplacements vers les centres d'affaires, le port et les zones de détente de la ville côtière.
            </p>
          </div>
          <Link
            to="/contact"
            className="gold-gradient-bg text-[#070d18] font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded shadow hover:brightness-110 transition-all shrink-0"
          >
            Nous Situer & Contacter
          </Link>
        </div>
      </div>
    </div>
  );
};
