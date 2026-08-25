import React, { FC } from 'react';
import { usePannellumVRViewerLogic } from './PannellumVRViewer.logic';
import {
  VrContainer,
  VrViewport,
  HotspotButton,
  VrControls,
} from './PannellumVRViewer.style';

export const PannellumVRViewer: FC = () => {
  const { activeRoom, isVirtualStagingActive, selectRoom, toggleVirtualStaging } = usePannellumVRViewerLogic();

  return (
    <VrContainer data-testid="pannellum-vr-viewer">
      <VrViewport>
        <div style={{ textAlign: 'center', opacity: 0.8 }}>
          <span style={{ fontSize: '3rem' }}>🥽</span>
          <h4 style={{ margin: '8px 0 4px', color: 'var(--accent-red, #EF4444)' }}>
            Pannellum WebGL 360° VR View — {activeRoom} {isVirtualStagingActive ? '(AI Staged)' : '(Empty)'}
          </h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Click hot-spots or drag to navigate 360° panorama</span>
        </div>

        <HotspotButton $top="40%" $left="30%" onClick={() => selectRoom('Master Bedroom')}>
          1
        </HotspotButton>
        <HotspotButton $top="60%" $left="70%" onClick={() => selectRoom('Kitchen')}>
          2
        </HotspotButton>
      </VrViewport>

      <VrControls>
        <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>📍 Room: <span style={{ color: 'var(--accent-red, #EF4444)' }}>{activeRoom}</span></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={toggleVirtualStaging}
            style={{ padding: '6px 12px', background: 'var(--color-334155, #334155)', border: 'none', borderRadius: '6px', color: 'var(--white, #FFF)', fontSize: '0.78rem', cursor: 'pointer' }}
          >
            {isVirtualStagingActive ? 'Disable AI Staging' : 'Enable AI Staging'}
          </button>
          <button style={{ padding: '6px 12px', background: 'var(--accent-red, #EF4444)', border: 'none', borderRadius: '6px', color: 'var(--white, #FFF)', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer' }}>
            WebXR Fullscreen
          </button>
        </div>
      </VrControls>
    </VrContainer>
  );
};

export default PannellumVRViewer;
