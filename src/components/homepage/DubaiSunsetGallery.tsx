import React, { FC, useState } from 'react';
import { Camera, MapPin, Eye, Sparkles, ChevronRight, X } from 'lucide-react';

export interface LuxurySunsetPhoto {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  goldenHourTime: string;
  tag: string;
  curatedBy: string;
}

export const CURATED_DUBAI_SUNSET_PHOTOS: LuxurySunsetPhoto[] = [
  {
    id: 'sunset-palm-01',
    title: 'Atlantis The Royal Sunset Horizon',
    location: 'Palm Jumeirah, Crescent',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    goldenHourTime: '17:42 GST',
    tag: 'Ultra-Prime Waterfront',
    curatedBy: 'White Caves Media Architecture',
  },
  {
    id: 'sunset-marina-02',
    title: 'Dubai Marina Twilight Yacht Promenade',
    location: 'Dubai Marina Channel',
    imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=85',
    goldenHourTime: '17:50 GST',
    tag: 'Skyline Reflections',
    curatedBy: 'Victoria Chen (Luxury Lead)',
  },
  {
    id: 'sunset-hills-03',
    title: 'Emerald Fairways Golden Hour Vista',
    location: 'Dubai Hills Estate',
    imageUrl: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1200&q=85',
    goldenHourTime: '17:38 GST',
    tag: 'Private Golf Sanctuary',
    curatedBy: 'White Caves Creative Guild',
  },
];

export interface DubaiSunsetGalleryProps {
  photos?: LuxurySunsetPhoto[];
  className?: string;
}

export const DubaiSunsetGallery: FC<DubaiSunsetGalleryProps> = ({
  photos = CURATED_DUBAI_SUNSET_PHOTOS,
  className = '',
}) => {
  const [activePhoto, setActivePhoto] = useState<LuxurySunsetPhoto | null>(null);

  return (
    <section
      aria-label="Curated Dubai Prime Sunset Photography"
      className={`py-8 ${className}`}
    >
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white shadow-lg shadow-rose-600/30">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Dubai Marina &amp; Palm Jumeirah Sunset Curation
            </h3>
            <p className="text-xs text-slate-400">
              High-resolution golden hour photography captured across Dubai prime waterfronts
            </p>
          </div>
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-amber-400">
          Target T-0010 · Verified 4K
        </span>
      </div>

      {/* Grid of Curated Sunset Photos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {photos.map(photo => (
          <div
            key={photo.id}
            role="button"
            tabIndex={0}
            onClick={() => setActivePhoto(photo)}
            onKeyDown={e => e.key === 'Enter' && setActivePhoto(photo)}
            className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/60 shadow-xl transition-all cursor-pointer aspect-[16/10]"
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 text-amber-300 text-[10px] font-bold backdrop-blur-md">
                {photo.goldenHourTime}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 text-left">
              <span className="text-[10px] text-red-400 font-extrabold uppercase tracking-wider">
                {photo.tag}
              </span>
              <h4 className="text-sm font-bold text-white truncate drop-shadow-md">
                {photo.title}
              </h4>
              <p className="flex items-center gap-1 text-[11px] text-slate-300 mt-0.5">
                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                <span className="truncate">{photo.location}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-labelledby="sunset-lightbox-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close photo preview"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.title}
              className="w-full max-h-[70vh] object-cover"
            />

            <div className="p-5 flex items-center justify-between flex-wrap gap-3 bg-slate-950">
              <div>
                <span className="text-xs text-red-400 font-extrabold uppercase tracking-wider">
                  {activePhoto.tag} · {activePhoto.goldenHourTime}
                </span>
                <h3 id="sunset-lightbox-title" className="text-base font-extrabold text-white">
                  {activePhoto.title}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  {activePhoto.location}
                </p>
              </div>
              <span className="text-xs text-slate-400 italic">
                {activePhoto.curatedBy}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DubaiSunsetGallery;
