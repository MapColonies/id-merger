import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { HttpError } from '@map-colonies/error-express-handler';
import { SERVICES } from '../../common/constants';

import { MergedModel, MergedIdMapping, MergeManager } from '../models/mergerManager';

type MergeHandler = RequestHandler<undefined, MergedModel[], MergedIdMapping>;

@injectable()
export class MergeController {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger, @inject(MergeManager) private readonly manager: MergeManager) {}
  public merge: MergeHandler = (req, res) => {
    let result;
    try {
      result = this.manager.merge(req.body);
    } catch (e) {
      const error = e as HttpError;
      error.status = httpStatus.UNPROCESSABLE_ENTITY;
      throw error;
    }
    return res.status(httpStatus.OK).json(result);
  };
}
