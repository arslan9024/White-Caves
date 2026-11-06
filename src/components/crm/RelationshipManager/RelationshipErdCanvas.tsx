/**
 * RelationshipErdCanvas.tsx
 * White Caves Real Estate LLC - Interactive UML Canvas for ERMS
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 * Protocol: RUP Interactive UML ERD Visualization
 */

import React, { FC, useRef, useState, useMemo } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Key, GitFork } from 'lucide-react';
import type { ERDClassModel, ERDRelation } from './RelationshipManager.types';

interface RelationshipErdCanvasProps {
  models: ERDClassModel[];
  relations: ERDRelation[];
  selectedModel: ERDClassModel | null;
  onSelectModel: (model: ERDClassModel) => void;
}

export const RelationshipErdCanvas: FC<RelationshipErdCanvasProps> = ({
  models,
  relations,
  selectedModel,
  onSelectModel,
}) => {
  const [zoom, setZoom] = useState<number>(0.9);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 30, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const modelMap = useMemo(() => {
    const map = new Map<string, ERDClassModel>();
    models.forEach(m => map.set(m.name, m));
    return map;
  }, [models]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.erd-node-card')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.45));
  const handleResetZoom = () => {
    setZoom(0.9);
    setPan({ x: 30, y: 30 });
  };

  return (
    <div
      className="relative w-full h-[620px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-inner"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      data-testid="erd-interactive-canvas"
    >
      {/* Zoom / Pan Floating Control Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur shadow-xl">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom In"
          data-testid="erd-zoom-in-btn"
        >
          <ZoomIn size={15} />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom Out"
          data-testid="erd-zoom-out-btn"
        >
          <ZoomOut size={15} />
        </button>
        <button
          type="button"
          onClick={handleResetZoom}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset Zoom & Pan"
          data-testid="erd-zoom-reset-btn"
        >
          <RotateCcw size={15} />
        </button>
        <div className="h-4 w-px bg-slate-800 mx-1" />
        <span className="text-[10px] font-mono font-bold text-emerald-400 px-1.5">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Canvas World */}
      <div
        className="absolute transition-transform duration-75 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: '1400px',
          height: '900px',
        }}
      >
        {/* SVG Connectors for UML Relationships */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#38BDF8" />
            </marker>
            <marker
              id="diamond-comp"
              viewBox="0 0 12 12"
              refX="6"
              refY="6"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <polygon points="6,0 12,6 6,12 0,6" fill="#F43F5E" />
            </marker>
            <marker
              id="diamond-agg"
              viewBox="0 0 12 12"
              refX="6"
              refY="6"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <polygon points="6,0 12,6 6,12 0,6" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
            </marker>
          </defs>

          {relations.map(rel => {
            const from = modelMap.get(rel.from);
            const to = modelMap.get(rel.to);
            if (!from || !to) return null;

            const x1 = (from.x || 0) + 130;
            const y1 = (from.y || 0) + 90;
            const x2 = (to.x || 0) + 130;
            const y2 = (to.y || 0) + 90;

            const isHighlighted =
              selectedModel && (selectedModel.name === rel.from || selectedModel.name === rel.to);

            const strokeColor =
              rel.type === 'COMPOSITION'
                ? '#F43F5E'
                : rel.type === 'AGGREGATION'
                  ? '#F59E0B'
                  : '#38BDF8';

            const markerStart =
              rel.type === 'COMPOSITION'
                ? 'url(#diamond-comp)'
                : rel.type === 'AGGREGATION'
                  ? 'url(#diamond-agg)'
                  : undefined;

            return (
              <g key={rel.id} className="transition-opacity duration-200">
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={strokeColor}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeDasharray={rel.type === 'ASSOCIATION' ? '4 2' : undefined}
                  markerStart={markerStart}
                  markerEnd="url(#arrow)"
                  opacity={isHighlighted ? 1 : 0.45}
                />
                {/* Edge Label */}
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 6}
                  fill="#94A3B8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="bg-slate-950 px-1"
                >
                  {rel.multiplicity} ({rel.label})
                </text>
              </g>
            );
          })}
        </svg>

        {/* HTML UML Node Cards */}
        {models.map(model => {
          const isSelected = selectedModel?.name === model.name;
          const isConnected =
            selectedModel &&
            relations.some(
              r =>
                (r.from === selectedModel.name && r.to === model.name) ||
                (r.to === selectedModel.name && r.from === model.name)
            );

          return (
            <div
              key={model.name}
              onClick={() => onSelectModel(model)}
              className={`erd-node-card absolute w-64 rounded-xl bg-slate-900/95 border transition-all cursor-pointer shadow-xl z-10 ${
                isSelected
                  ? 'border-emerald-400 ring-2 ring-emerald-500/30 shadow-emerald-500/10'
                  : isConnected
                    ? 'border-sky-400/80 ring-1 ring-sky-500/20'
                    : 'border-slate-800 hover:border-slate-700'
              }`}
              style={{
                left: `${model.x || 50}px`,
                top: `${model.y || 50}px`,
              }}
              data-testid={`erd-canvas-node-${model.name}`}
            >
              {/* Header */}
              <div className="px-3 py-2 bg-slate-950/80 border-b border-slate-800 rounded-t-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-amber-400 font-bold block">
                    {model.stereotype}
                  </span>
                  <span className="text-xs font-bold text-white font-mono">{model.name}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-slate-800 text-slate-300">
                  {model.domain}
                </span>
              </div>

              {/* Attributes (Top 4) */}
              <div className="p-2.5 divide-y divide-slate-800/60 font-mono text-[10px]">
                {model.attributes.slice(0, 4).map(attr => (
                  <div key={attr.name} className="py-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {attr.isPk ? (
                        <Key size={10} className="text-amber-400" />
                      ) : attr.isFk ? (
                        <GitFork size={10} className="text-sky-400" />
                      ) : (
                        <span className="w-2.5 text-slate-600">·</span>
                      )}
                      <span
                        className={
                          attr.isPk
                            ? 'text-amber-300 font-bold'
                            : attr.isFk
                              ? 'text-sky-300'
                              : 'text-slate-300'
                        }
                      >
                        {attr.name}
                      </span>
                    </div>
                    <span className="text-slate-500 text-[9px]">{attr.type}</span>
                  </div>
                ))}
                {model.attributes.length > 4 && (
                  <div className="pt-1 text-[9px] text-slate-500 text-center">
                    +{model.attributes.length - 4} more attributes...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelationshipErdCanvas;
