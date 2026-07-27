import React, { useRef, useEffect, useState, MouseEvent, FC } from 'react';
import { Participant, AnnotationShape, DrawingTool, AnnotationPoint } from '../../hooks/useCoBrowsing';
import { MousePointer, Edit2, Square, MapPin, Trash2 } from 'lucide-react';

interface AnnotationLayerProps {
  participants: Participant[];
  annotations: AnnotationShape[];
  activeTool: DrawingTool;
  strokeColor: string;
  strokeWidth: number;
  currentUserId?: string;
  onMouseMove?: (x: number, y: number) => void;
  onAddAnnotation: (shape: Omit<AnnotationShape, 'id' | 'authorId'>) => void;
  onClearAnnotations: () => void;
  width?: number | string;
  height?: number | string;
  children?: React.ReactNode;
}

export const AnnotationLayer: FC<AnnotationLayerProps> = ({
  participants,
  annotations,
  activeTool,
  strokeColor,
  strokeWidth,
  currentUserId = 'user-local',
  onMouseMove,
  onAddAnnotation,
  onClearAnnotations,
  width = '100%',
  height = '600px',
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentPoints, setCurrentPoints] = useState<AnnotationPoint[]>([]);
  const [startPoint, setStartPoint] = useState<AnnotationPoint | null>(null);
  const [currentRectEnd, setCurrentRectEnd] = useState<AnnotationPoint | null>(null);

  // Resize canvas to container dimensions
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width;
        canvasRef.current.height = rect.height;
        drawCanvas();
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [annotations, currentPoints, currentRectEnd]);

  // Main Canvas Rendering Loop
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw committed annotations
    annotations.forEach((shape) => {
      ctx.strokeStyle = shape.color;
      ctx.fillStyle = shape.color;
      ctx.lineWidth = shape.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (shape.type === 'pen' && shape.points && shape.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.stroke();
      } else if (shape.type === 'rectangle' && shape.start && shape.end) {
        const x = Math.min(shape.start.x, shape.end.x);
        const y = Math.min(shape.start.y, shape.end.y);
        const w = Math.abs(shape.start.x - shape.end.x);
        const h = Math.abs(shape.start.y - shape.end.y);
        ctx.strokeRect(x, y, w, h);
      } else if (shape.type === 'pin' && shape.start) {
        ctx.beginPath();
        ctx.arc(shape.start.x, shape.start.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(shape.start.x, shape.start.y, 14, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw active transient stroke
    if (isDrawing) {
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = strokeColor;
      ctx.lineWidth = strokeWidth;

      if (activeTool === 'pen' && currentPoints.length > 1) {
        ctx.beginPath();
        ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
        for (let i = 1; i < currentPoints.length; i++) {
          ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
        }
        ctx.stroke();
      } else if (activeTool === 'rectangle' && startPoint && currentRectEnd) {
        const x = Math.min(startPoint.x, currentRectEnd.x);
        const y = Math.min(startPoint.y, currentRectEnd.y);
        const w = Math.abs(startPoint.x - currentRectEnd.x);
        const h = Math.abs(startPoint.y - currentRectEnd.y);
        ctx.strokeRect(x, y, w, h);
      }
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [annotations, currentPoints, currentRectEnd, isDrawing, strokeColor, strokeWidth, activeTool]);

  const getCanvasCoords = (e: MouseEvent): AnnotationPoint => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (activeTool === 'select') return;
    const pt = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPoint(pt);

    if (activeTool === 'pen') {
      setCurrentPoints([pt]);
    } else if (activeTool === 'pin') {
      onAddAnnotation({
        type: 'pin',
        start: pt,
        color: strokeColor,
        strokeWidth,
      });
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const pt = getCanvasCoords(e);
    if (onMouseMove) {
      onMouseMove(pt.x, pt.y);
    }

    if (!isDrawing) return;

    if (activeTool === 'pen') {
      setCurrentPoints((prev) => [...prev, pt]);
    } else if (activeTool === 'rectangle') {
      setCurrentRectEnd(pt);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDrawing) return;
    const pt = getCanvasCoords(e);

    if (activeTool === 'pen' && currentPoints.length > 0) {
      onAddAnnotation({
        type: 'pen',
        points: [...currentPoints, pt],
        color: strokeColor,
        strokeWidth,
      });
    } else if (activeTool === 'rectangle' && startPoint) {
      onAddAnnotation({
        type: 'rectangle',
        start: startPoint,
        end: pt,
        color: strokeColor,
        strokeWidth,
      });
    }

    setIsDrawing(false);
    setCurrentPoints([]);
    setStartPoint(null);
    setCurrentRectEnd(null);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDrawing(false)}
    >
      {/* Background Content / Floorplan / Virtual Tour */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>{children}</div>

      {/* Interactive Drawing Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          cursor: activeTool === 'select' ? 'default' : 'crosshair',
          pointerEvents: activeTool === 'select' ? 'none' : 'auto',
        }}
      />

      {/* Remote Investor Cursor Overlay Badges */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
        {participants
          .filter((p) => p.id !== currentUserId)
          .map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.cursor.x}px`,
                top: `${p.cursor.y}px`,
                transform: 'translate(-2px, -2px)',
                transition: 'all 0.05s linear',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {/* Cursor Icon */}
              <MousePointer
                size={18}
                style={{
                  fill: p.avatarColor || '#EF4444',
                  color: '#FFFFFF',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                }}
              />
              {/* Participant Name Badge */}
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#1E293B',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: `1.5px solid ${p.avatarColor || '#EF4444'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.name} ({p.role})
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AnnotationLayer;
