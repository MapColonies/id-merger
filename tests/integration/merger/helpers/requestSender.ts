import * as supertest from 'supertest';
import { Application } from 'express';

import { container } from 'tsyringe';
import { ServerBuilder } from '../../../../src/serverBuilder';
import { MergedIdMapping } from '../../../../src/merger/models/mergerManager';

let app: Application | null = null;

export function init(): void {
  const builder = container.resolve<ServerBuilder>(ServerBuilder);
  app = builder.build();
}

export async function merge(body: MergedIdMapping): Promise<supertest.Response> {
  return supertest.agent(app).post('/merge').send(body);
}
