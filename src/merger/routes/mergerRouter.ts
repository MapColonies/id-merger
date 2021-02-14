import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { MergeController } from '../controllers/mergerController';

const mergeRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(MergeController);

  router.post('/', controller.merge);

  return router;
};

export { mergeRouterFactory };
