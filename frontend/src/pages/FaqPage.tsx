import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { initialSiteSettings } from '../data/initialData';

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Comment fonctionne la réservation en ligne sur le site ?",
      a: "Vous remplissez vos dates, la chambre voulue ainsi que vos coordonnées. Notre système génère une référence unique et place la demande en statut « En attente de confirmation ». Aucun paiement n'est exigé en ligne. Le responsable de l'hôtel vérifie la disponibilité exacte et vous contacte par téléphone ou WhatsApp pour finaliser et confirmer votre réservation."
    },
    {
      q: "Quelles sont les heures d'arrivée (Check-in) et de départ (Check-out) ?",
      a: "Les arrivées s'effectuent à partir de 14h00 et les départs jusqu'à 12h00. Si vous prévoyez une arrivée tardive ou matinale à Pointe-Noire (vols, impératifs professionnels), nous vous invitons à le préciser dans vos demandes particulières afin d'organiser votre accueil."
    },
    {
      q: "Quels sont les modes de règlement acceptés ?",
      a: `Le règlement s'effectue directement à la réception de l'hôtel en Francs CFA (${initialSiteSettings.currency}), par espèces, carte bancaire ou selon les modalités convenues avec le responsable lors de la confirmation manuelle.`
    },
    {
      q: "Puis-je acheter des bouteilles de la cave sans séjourner à l'hôtel ?",
      a: "Oui, la Cave de l'Hôtel Corneille est accessible tant aux résidents de l'hôtel qu'à la clientèle extérieure. Vous pouvez commander directement ou solliciter des coffrets cadeaux et réceptions d'affaires."
    },
    {
      q: "Existe-t-il un service de navette ou transfert aéroport ?",
      a: "Un service de transfert privé depuis l'aéroport international Antonio-Agostinho-Neto de Pointe-Noire peut être coordonné sur demande préalable auprès de notre réception."
    },
    {
      q: "Quelles sont les conditions d'annulation ?",
      a: "Toute demande d'annulation ou de modification doit être signalée au moins 24 heures avant la date d'arrivée prévue afin de libérer l'hébergement."
    }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12">
      {/* Header */}
      <div className="bg-[#070d18] text-white py-16 px-4 mb-12 border-b border-[#c5a059]/30">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfba73] font-bold block mb-2">
            Transparence & Sérénité
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
            FAQ & Conditions de Réservation
          </h1>
          <p className="max-w-xl mx-auto text-slate-300 text-sm font-light">
            Retrouvez ici les réponses aux interrogations fréquentes concernant le déroulement de votre séjour et le fonctionnement de notre établissement.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Accordéon FAQ */}
        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="font-serif font-bold text-[#070d18] text-base sm:text-lg pr-4">
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#c5a059] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Charte & Conditions */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#070d18] flex items-center">
            <ShieldCheck className="w-5 h-5 text-[#c5a059] mr-2" />
            Engagements de Corneille Hôtel & Cave
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Afin de préserver la tranquillité et le bien-être de l'ensemble de notre clientèle à Pointe-Noire, les animaux de compagnie ne sont pas admis dans les chambres sans accord formel préalable. Les espaces intérieurs sont strictement non-fumeurs (des espaces aménagés sont à disposition).
          </p>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center flex-wrap gap-4">
            <span className="text-xs text-slate-500">Besoin d'un renseignement complémentaire ?</span>
            <Link
              to="/contact"
              className="text-xs font-bold text-[#9e7d3b] hover:underline"
            >
              Écrire à notre réception →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
