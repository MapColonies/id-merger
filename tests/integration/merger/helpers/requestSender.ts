import * as supertest from 'supertest';

import { MergedIdMapping } from '../../../../src/merger/models/mergerManager';

export class MergerRequestSender {
  public constructor(private readonly app: Express.Application) {}

  public async merge(body: MergedIdMapping): Promise<supertest.Response> {
    return supertest.agent(this.app).post('/merge').send(body);
  }
}
