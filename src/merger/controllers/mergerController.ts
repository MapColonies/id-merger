import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { HttpError } from '@map-colonies/error-express-handler';
import { trace, context } from '@opentelemetry/api';
import { Services, TRACING } from '../../common/constants';
import { MergedModel, MergedIdMapping, MergeManager } from '../models/mergerManager';

type MergeHandler = RequestHandler<undefined, MergedModel[], MergedIdMapping>;

@injectable()
export class MergeController {
  public constructor(@inject(Services.LOGGER) private readonly logger: Logger, @inject(MergeManager) private readonly manager: MergeManager) {}
  public merge: MergeHandler = (req, res) => {
    let result;
    try {
      result = this.manager.merge(req.body);
    } catch (e) {
      const error = e as HttpError;
      error.status = httpStatus.UNPROCESSABLE_ENTITY;
      throw error;
    }
    const currentSpan = trace.getSpan(context.active());
    currentSpan?.setAttribute(`${TRACING.APP}.${TRACING.ENTITIES}.count`, result.length);
    return res.status(httpStatus.OK).json(result);
  };
}
