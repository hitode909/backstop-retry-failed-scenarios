import {TraceProfiler} from '../lib/TraceProfiler';
import {performance} from 'perf_hooks';

function mockPerformanceNow(timestamp: number, fn: () => void): void {
  const nativePerformanceNow = performance.now;
  performance.now = jest.fn(() => timestamp);
  fn();
  performance.now = nativePerformanceNow;
}

describe('TraceProfiler', () => {
  describe('start', () => {
    test('can be called for labels that have not yet started tracing', () => {
      const profiler = new TraceProfiler();
      expect(() => {
        profiler.start('1');
      }).not.toThrow();
      expect(() => {
        profiler.start('2');
      }).not.toThrow();
    });
    test('cannot be called for a label that has already started tracing', () => {
      const profiler = new TraceProfiler();
      expect(() => {
        profiler.start('1');
      }).not.toThrow();
      expect(() => {
        profiler.start('1');
      }).toThrowErrorMatchingInlineSnapshot(
        // eslint-disable-next-line quotes
        `"'1' has already started tracing."`
      );
    });
  });

  describe('end', () => {
    test('can be called for a label that has already started tracing', () => {
      const profiler = new TraceProfiler();
      profiler.start('1');
      expect(() => {
        profiler.end('1');
      }).not.toThrow();
    });
    test("cannot be called for a label that hasn't started tracing yet", () => {
      const profiler = new TraceProfiler();
      expect(() => {
        profiler.end('1');
      }).toThrowErrorMatchingInlineSnapshot(
        // eslint-disable-next-line quotes
        `"'1' has not yet started tracing."`
      );
    });
    test('cannot be called for a label that has already ended tracing', () => {
      const profiler = new TraceProfiler();
      profiler.start('1');
      profiler.end('1');
      expect(() => {
        profiler.end('1');
      }).toThrowErrorMatchingInlineSnapshot(
        // eslint-disable-next-line quotes
        `"'1' has already ended tracing."`
      );
    });
  });

  describe('generateReport', () => {
    test('can generate a empty report', () => {
      const profiler = new TraceProfiler();
      expect(profiler.generateReport()).toEqual([]);
    });
    test('can generate a non-empty report', () => {
      const profiler = new TraceProfiler();
      Date.now = jest.fn(() => 0);
      mockPerformanceNow(0, () => profiler.start('1'));
      mockPerformanceNow(1000, () => profiler.end('1'));
      mockPerformanceNow(2000, () => profiler.start('2'));
      mockPerformanceNow(3000, () => profiler.end('2'));
      expect(profiler.generateReport()).toEqual([
        {label: '1', duration: 1000, startTime: 0, endTime: 1000},
        {label: '2', duration: 1000, startTime: 2000, endTime: 3000},
      ]);
    });
    test('generates a report that excludes traces that have not ended', () => {
      const profiler = new TraceProfiler();
      mockPerformanceNow(0, () => profiler.start('1'));
      mockPerformanceNow(1000, () => profiler.end('1'));
      mockPerformanceNow(2000, () => profiler.start('2'));
      expect(profiler.generateReport()).toEqual([
        {label: '1', duration: 1000, startTime: 0, endTime: 1000},
      ]);
    });
  });
});
