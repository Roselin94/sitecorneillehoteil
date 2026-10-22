import React, { useState } from 'react';
import { sampleGallery } from '../data/initialData';
import { Camera, Eye } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('TOUS');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const categories = ['TOUS', 'Hôtel', 'Chambres', 'Cave', 'Lounge'];

  const filteredItems = selectedFilter === 'TOUS'
    ? sampleGallery
    : sampleGallery.filter(item => item.category === selectedFilter);

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12">
      {/* Header */}
      <div className="bg-[#070d18] text-white py-16 px-4 mb-12 border-b border-[#c5a059]/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-[#c5a059]/40 text-[#dfba73] text-xs font-semibold uppercase tracking-widest mb-3">
            <Camera className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Immersion Visuelle</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
            Galerie Photographique
          </h1>
          <p className="max-w-xl mx-auto text-slate-300 text-sm font-light">
            Découvrez l'atmosphère unique, le raffinement des intérieurs et les détails soignés de notre établissement à Pointe-Noire.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filtres */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                selectedFilter === cat
                  ? 'gold-gradient-bg text-[#070d18] shadow'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-[#c5a059]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille de photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setPreviewImage(item.url)}
              className="group relative h-72 rounded-xl overflow-hidden cursor-pointer shadow-md bg-slate-900 border border-slate-200"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070d18]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] tracking-widest uppercase text-[#dfba73] font-bold block mb-1">
                  {item.category}
                </span>
                <h4 className="font-serif text-base font-bold text-white flex items-center justify-between">
                  <span>{item.title}</span>
                  <Eye className="w-4 h-4 text-[#c5a059]" />
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Plein Écran */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={previewImage}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/20"
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full text-sm font-bold"
            >
              ✕ Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
