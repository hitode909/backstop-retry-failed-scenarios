import {performance} from 'perf_hooks';

type Span =
  | {
      startTime: number;
    }
  | {
      startTime: number;
      endTime: number;
    };

type ReportRecord = {
  label: string;
  duration: number;
  startTime: number;
  endTime: number;
};
type Report = ReportRecord[];

export class TraceProfiler {
  traces: Map<string, Span>;
  constructor() {
    this.traces = new Map();
  }
  start(label: string): void {
    if (this.traces.has(label))
      throw new Error(`'${label}' has already started tracing.`);
    this.traces.set(label, {startTime: performance.now()});
  }
  end(label: string): void {
    const span = this.traces.get(label);
    if (span === undefined)
      throw new Error(`'${label}' has not yet started tracing.`);
    if ('endTime' in span)
      throw new Error(`'${label}' has already ended tracing.`);
    this.traces.set(label, {...span, endTime: performance.now()});
  }
  generateReport(): Report {
    const report: Report = [];
    for (const [label, span] of this.traces.entries()) {
      if ('endTime' in span) {
        report.push({
          label,
          duration: span.endTime - span.startTime,
          ...span,
        });
      }
    }
    return report;
  }
}
