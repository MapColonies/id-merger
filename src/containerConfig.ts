import { container } from 'tsyringe';
import config from 'config';
import { getOtelMixin, Metrics } from '@map-colonies/telemetry';
import jsLogger, { LoggerOptions } from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import { metrics } from '@opentelemetry/api-metrics';
import { Services } from './common/constants';
import { tracing } from './common/tracing';

function registerExternalValues(): void {
  const loggerConfig = config.get<LoggerOptions>('telemetry.logger');
  const logger = jsLogger({ ...loggerConfig, mixin: getOtelMixin() });
  container.register(Services.CONFIG, { useValue: config });
  container.register(Services.LOGGER, { useValue: logger });

  const otelMetrics = new Metrics();
  otelMetrics.start();
  container.register(Services.METER, { useValue: metrics.getMeter('id-merger') });

  const tracer = trace.getTracer('id-merger');
  container.register(Services.TRACER, { useValue: tracer });

  container.register('onSignal', {
    useValue: async (): Promise<void> => {
      await Promise.all([tracing.stop(), otelMetrics.stop()]);
    },
  });
}

export { registerExternalValues };
