import express, { Router } from 'express';
import { Registry } from 'prom-client';
import bodyParser from 'body-parser';
import compression from 'compression';
import { getErrorHandlerMiddleware } from '@map-colonies/error-express-handler';
import { OpenapiViewerRouter, OpenapiRouterConfig } from '@map-colonies/openapi-express-viewer';
import { middleware as OpenApiMiddleware } from 'express-openapi-validator';
import { inject, injectable } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import httpLogger from '@map-colonies/express-access-log-middleware';
import { getTraceContexHeaderMiddleware, metricsMiddleware } from '@map-colonies/telemetry';
import { SERVICES, METRICS_REGISTRY } from './common/constants';
import { IConfig } from './common/interfaces';
import { MERGE_ROUTER_SYMBOL } from './merger/routes/mergerRouter';

@injectable()
export class ServerBuilder {
  private readonly serverInstance: express.Application;

  public constructor(
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(MERGE_ROUTER_SYMBOL) private readonly mergerRouter: Router,
    @inject(METRICS_REGISTRY) private readonly metricsRegistry?: Registry
  ) {
    this.serverInstance = express();
  }

  public build(): express.Application {
    this.registerPreRoutesMiddleware();
    this.buildRoutes();
    this.registerPostRoutesMiddleware();

    return this.serverInstance;
  }

  private buildRoutes(): void {
    this.serverInstance.use('/merge', this.mergerRouter);
    this.buildDocsRoutes();
  }

  private buildDocsRoutes(): void {
    const openapiRouter = new OpenapiViewerRouter({
      ...this.config.get<OpenapiRouterConfig>('openapiConfig'),
      filePathOrSpec: this.config.get<string>('openapiConfig.filePath'),
    });
    openapiRouter.setup();
    this.serverInstance.use(this.config.get<string>('openapiConfig.basePath'), openapiRouter.getRouter());
  }

  private registerPreRoutesMiddleware(): void {
    if (this.metricsRegistry) {
      this.serverInstance.use('/metrics', metricsMiddleware(this.metricsRegistry));
    }

    if (this.config.get<boolean>('server.response.compression.enabled')) {
      this.serverInstance.use(compression(this.config.get<compression.CompressionFilter>('server.response.compression.options')));
    }
    this.serverInstance.use(httpLogger({ logger: this.logger }));
    this.serverInstance.use(express.json(this.config.get<bodyParser.Options>('server.request.payload')));
    this.serverInstance.use(getTraceContexHeaderMiddleware());

    const ignorePathRegex = new RegExp(`^${this.config.get<string>('openapiConfig.basePath')}/.*`, 'i');
    const apiSpecPath = this.config.get<string>('openapiConfig.filePath');
    this.serverInstance.use(OpenApiMiddleware({ apiSpec: apiSpecPath, validateRequests: true, ignorePaths: ignorePathRegex }));
  }

  private registerPostRoutesMiddleware(): void {
    this.serverInstance.use(getErrorHandlerMiddleware());
  }
}
