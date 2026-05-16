import React, { memo, useMemo } from 'react';
import { ExternalLink, ServerCrash } from 'lucide-react';
import {
  getInternalModuleMountConfig,
  type InternalModuleMountConfig,
} from '../../../config/internalModuleMounts';

interface InternalModuleMountProps {
  assistantId: string;
  fallback: React.ReactNode;
  className?: string;
}

const frameStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 560,
  border: '1px solid rgba(148, 163, 184, 0.28)',
  borderRadius: 12,
  background: 'rgba(15, 23, 42, 0.62)',
};

const renderIframeMount = (config: InternalModuleMountConfig) => {
  if (!config.moduleUrl) {
    return null;
  }

  return (
    <section aria-label={`${config.displayName} module mount`}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <div>
          <h3 style={{ margin: 0, color: '#E2E8F0', fontSize: 14 }}>{config.displayName}</h3>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: 12 }}>{config.description}</p>
        </div>
        <a
          href={config.moduleUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#67E8F9',
            fontSize: 12,
            textDecoration: 'none',
          }}
          aria-label={`Open ${config.displayName} in new tab`}
        >
          Open module <ExternalLink size={14} />
        </a>
      </div>

      <iframe
        title={`${config.displayName} frame`}
        src={config.moduleUrl}
        style={frameStyle}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </section>
  );
};

const InternalModuleMount = memo(({ assistantId, fallback, className }: InternalModuleMountProps) => {
  const mountConfig = useMemo(() => getInternalModuleMountConfig(assistantId), [assistantId]);

  if (!mountConfig || !mountConfig.enabled) {
    return <>{fallback}</>;
  }

  if (mountConfig.mountMode === 'iframe') {
    const iframeMount = renderIframeMount(mountConfig);
    if (iframeMount) {
      return <div className={className}>{iframeMount}</div>;
    }

    return (
      <div className={className}>
        <div
          style={{
            border: '1px solid rgba(239, 68, 68, 0.32)',
            borderRadius: 12,
            padding: 14,
            background: 'rgba(127, 29, 29, 0.18)',
            color: '#FECACA',
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <ServerCrash size={18} />
          <span>Module mount configuration is enabled but moduleUrl is missing. Showing native fallback.</span>
        </div>
        <div style={{ marginTop: 12 }}>{fallback}</div>
      </div>
    );
  }

  return <>{fallback}</>;
});

InternalModuleMount.displayName = 'InternalModuleMount';

export default InternalModuleMount;
