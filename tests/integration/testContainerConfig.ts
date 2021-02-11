import { container } from 'tsyringe';
import config from 'config';
import { Services } from '../../src/common/constants';

function registerTestValues(): void {
  const logger = { log: jest.fn() };
  container.register(Services.CONFIG, { useValue: config });
  container.register(Services.LOGGER, { useValue: logger });
}

export { registerTestValues };
