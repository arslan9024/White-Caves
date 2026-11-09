/**
 * DepartmentOverviewSectionsGuide.tsx
 * White Caves Real Estate LLC — 13-Story Building Spatial Structure & Bhakti Ratio Guide
 * Standard: AEGIS View Primitive (< 200 lines)
 */

import React, { FC } from 'react';
import { Crown, Shield, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { BHAKTI_BUILDING_SECTIONS } from '../../../data/departmentSections.data';

export interface DepartmentOverviewSectionsGuideProps {
  onNavigateSection: (sectionKey: 'SECTION_A' | 'SECTION_B' | 'SECTION_C') => void;
}

export const DepartmentOverviewSectionsGuide: FC<DepartmentOverviewSectionsGuideProps> = ({
  onNavigateSection,
}) => {
  const sections = [
    {
      def: BHAKTI_BUILDING_SECTIONS.PENTHOUSE,
      icon: Crown,
      badge: 'FL-13 Sovereign',
      actionLabel: 'Sovereign MD Suite',
      isPenthouse: true,
    },
    {
      def: BHAKTI_BUILDING_SECTIONS.SECTION_A,
      icon: Shield,
      badge: 'FL 09 – 12',
      actionLabel: 'Filter Section A',
      key: 'SECTION_A' as const,
    },
    {
      def: BHAKTI_BUILDING_SECTIONS.SECTION_B,
      icon: TrendingUp,
      badge: 'FL 05 – 08',
      actionLabel: 'Filter Section B',
      key: 'SECTION_B' as const,
    },
    {
      def: BHAKTI_BUILDING_SECTIONS.SECTION_C,
      icon: Users,
      badge: 'FL 01 – 04',
      actionLabel: 'Filter Section C',
      key: 'SECTION_C' as const,
    },
  ];

  return (
    <div className="space-y-3" data-testid="dms-building-sections-guide">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
            🏛️ 13-Story Headquarters Spatial Hierarchy (Bhakti 1-12-108 Protocol)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Architecture cleanly isolated into 3 operational sections + Sovereign Penthouse.
          </p>
        </div>
        <div className="text-[11px] font-mono text-red-400 bg-red-950/40 px-2.5 py-1 rounded-full border border-red-800/40">
          Ratio: 1 MD → 12 Directors → 108 Squads
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {sections.map(({ def, icon: Icon, badge, actionLabel, isPenthouse, key }) => (
          <div
            key={def.key}
            style={{ borderColor: def.borderColor, background: def.bgGradient }}
            className="p-4 rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all hover:scale-[1.01]"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  style={{ color: def.color, backgroundColor: 'rgba(0,0,0,0.4)' }}
                  className="px-2 py-0.5 rounded text-[10px] font-bold font-mono border border-slate-700/50"
                >
                  {badge}
                </span>
                <Icon size={16} style={{ color: def.color }} />
              </div>

              <h4 className="text-xs font-black text-white tracking-tight">{def.title}</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-3">
                {def.description}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
                {def.statutoryRole}
              </span>
              {!isPenthouse && key && (
                <button
                  type="button"
                  onClick={() => onNavigateSection(key)}
                  data-testid={`dms-filter-section-${key}`}
                  className="flex items-center gap-1 text-[10px] font-bold text-white hover:text-red-400 cursor-pointer"
                >
                  <span>View</span>
                  <ArrowRight size={10} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
