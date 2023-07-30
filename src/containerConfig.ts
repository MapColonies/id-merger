import config from 'config';
import { getOtelMixin, Metrics } from '@map-colonies/telemetry';
import jsLogger, { LoggerOptions } from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import { DependencyContainer } from 'tsyringe/dist/typings/types';
import { metrics } from '@opentelemetry/api-metrics';
import { Services, SERVICE_NAME } from './common/constants';
import { tracing } from './common/tracing';
import { mergeRouterFactory, MERGE_ROUTER_SYMBOL } from './merger/routes/mergerRouter';
import { InjectionObject, registerDependencies } from './common/dependencyRegistration';

export interface RegisterOptions {
  override?: InjectionObject<unknown>[];
  useChild?: boolean;
}

export const registerExternalValues = (options?: RegisterOptions): DependencyContainer => {
  const loggerConfig = config.get<LoggerOptions>('telemetry.logger');
  const logger = jsLogger({ ...loggerConfig, prettyPrint: loggerConfig.prettyPrint, mixin: getOtelMixin() });

  const otelMetrics = new Metrics();
  otelMetrics.start();

  const tracer = trace.getTracer(SERVICE_NAME);

  const dependencies: InjectionObject<unknown>[] = [
    { token: Services.CONFIG, provider: { useValue: config } },
    { token: Services.LOGGER, provider: { useValue: logger } },
    { token: Services.TRACER, provider: { useValue: tracer } },
    { token: Services.METER, provider: { useValue: metrics.getMeter(SERVICE_NAME) } },
    { token: MERGE_ROUTER_SYMBOL, provider: { useFactory: mergeRouterFactory } },
    {
      token: 'onSignal',
      provider: {
        useValue: {
          useValue: async (): Promise<void> => {
            await Promise.all([tracing.stop(), otelMetrics.stop()]);
          },
        },
      },
    },
  ];
  return registerDependencies(dependencies, options?.override, options?.useChild);
};
