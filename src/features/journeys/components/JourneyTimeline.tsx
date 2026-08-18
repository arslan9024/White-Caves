import React from 'react';
import { JourneySession, TimelineEvent } from '../../../types/journey';
import { JourneyEngineService } from '../../../services/journeys/journeyEngineService';

interface JourneyTimelineProps {
  entityId?: string;
  activeSession?: JourneySession;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  entityId,
  activeSession
}) => {
  const lifecycleHistory = JourneyEngineService.getLifecycleHistory(entityId);
  const activeTimeline = activeSession?.timeline || [];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-slate-100 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📜</span>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            Tenancy Lifecycle & Audit Trail
          </h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
          {lifecycleHistory.length + (activeSession ? 1 : 0)} Events Recorded
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
        {/* Active Session in-flight events */}
        {activeTimeline.map((event) => (
          <div key={event.id} className="relative group">
            <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-900 group-hover:scale-125 transition-transform" />
            <div className="text-xs font-semibold text-white">{event.title}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{event.description}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
              <span>{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span>•</span>
              <span className="text-amber-400/80">{event.actor}</span>
            </div>
          </div>
        ))}

        {/* Completed Lifecycle Sessions */}
        {lifecycleHistory.map((session) => (
          <div key={session.sessionId} className="relative group">
            <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 group-hover:scale-125 transition-transform" />
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-emerald-300">
                ✓ {session.result?.title || 'Completed Journey'}
              </div>
              <span className="text-[10px] text-slate-500">
                {new Date(session.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Ref: <span className="font-mono text-amber-400">{session.result?.referenceNumber || 'N/A'}</span>
            </div>
          </div>
        ))}

        {activeTimeline.length === 0 && lifecycleHistory.length === 0 && (
          <div className="text-xs text-slate-500 italic py-2">
            No lifecycle events recorded for this entity yet.
          </div>
        )}
      </div>
    </div>
  );
};
