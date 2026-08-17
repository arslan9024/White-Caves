/**
 * OpenTelemetryTraceCollector.ts — Distributed Tracing & Route Latency Sentinel
 * GOAL-092: OpenTelemetry distributed trace collector for API route latency monitoring
 *
 * White Caves Real Estate LLC — Infrastructure & SQA Sentinel
 */

export interface TraceSpan {
  traceId: string;
  spanId: string;
  name: string;
  startTime: number;
  durationMs: number;
  statusCode: 'OK' | 'ERROR';
  attributes: Record<string, string | number | boolean>;
}

export class OpenTelemetryTraceCollector {
  private static spans: TraceSpan[] = [];
  private static isSamplingEnabled = true;

  public static startSpan(name: string, attributes: Record<string, string | number | boolean> = {}): {
    spanId: string;
    end: (statusCode?: 'OK' | 'ERROR') => TraceSpan;
  } {
    const traceId = `trc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const spanId = `spn_${Math.random().toString(36).substring(2, 8)}`;
    const startTime = performance.now();

    return {
      spanId,
      end: (statusCode: 'OK' | 'ERROR' = 'OK'): TraceSpan => {
        const durationMs = performance.now() - startTime;
        const span: TraceSpan = {
          traceId,
          spanId,
          name,
          startTime,
          durationMs,
          statusCode,
          attributes: {
            ...attributes,
            environment: typeof window !== 'undefined' ? 'browser' : 'node',
          },
        };

        if (this.isSamplingEnabled) {
          this.spans.push(span);
          if (this.spans.length > 500) {
            this.spans.shift();
          }
        }
        return span;
      },
    };
  }

  public static getRecentSpans(): TraceSpan[] {
    return [...this.spans];
  }

  public static getAverageLatencyMs(spanName?: string): number {
    const relevant = spanName ? this.spans.filter(s => s.name === spanName) : this.spans;
    if (relevant.length === 0) return 0;
    const total = relevant.reduce((sum, s) => sum + s.durationMs, 0);
    return Number((total / relevant.length).toFixed(2));
  }

  public static clear(): void {
    this.spans = [];
  }
}

export default OpenTelemetryTraceCollector;
