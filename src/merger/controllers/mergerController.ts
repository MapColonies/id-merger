import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { HttpError } from '@map-colonies/error-express-handler';
import { Services } from '../../common/constants';
import { ILogger } from '../../common/interfaces';

import { IMergedModel, IJsonId, MergeManager } from '../models/mergerManager';

type MergeHandler = RequestHandler<undefined, IMergedModel[], IJsonId>;

@injectable()
export class MergeController {
  public constructor(@inject(Services.LOGGER) private readonly logger: ILogger, @inject(MergeManager) private readonly manager: MergeManager) {}
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
