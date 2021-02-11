import httpStatusCodes from 'http-status-codes';
import { container } from 'tsyringe';

import { registerTestValues } from '../testContainerConfig';
import * as requestSender from './helpers/requestSender';

describe('merge', function () {
  beforeAll(function () {
    registerTestValues();
    requestSender.init();
  });
  afterEach(function () {
    container.clearInstances();
  });

  describe('Happy Path', function () {
    it('should return 200 status code and the resource', async function () {
      const body = {
        externalMapping: [
          {
            tempOsmId: -1,
            externalId: 'uuid1',
          },
          {
            tempOsmId: -2,
            externalId: 'uuid2',
          },
          {
            tempOsmId: -3,
            externalId: 'uuid3',
          },
        ],
        osmMapping: [
          {
            tempOsmId: -1,
            osmId: 1,
          },
          {
            tempOsmId: -2,
            osmId: 2,
          },
          {
            tempOsmId: -3,
            osmId: 3,
          },
          {
            tempOsmId: -4,
            osmId: 4,
          },
        ],
      };
      const expected = [
        {
          externalId: 'uuid1',
          osmId: 1,
        },
        {
          externalId: 'uuid2',
          osmId: 2,
        },
        {
          externalId: 'uuid3',
          osmId: 3,
        },
      ];
      const response = await requestSender.merge(body);

      expect(response).toHaveProperty('status', httpStatusCodes.OK);
      expect(response).toHaveProperty('body', expected);
    });
  });

  describe('Sad Path', function () {
    it('should return 422 status code and not found tempOsmId message', async function () {
      const body = {
        externalMapping: [
          {
            tempOsmId: -1,
            externalId: 'uuid1',
          },
          {
            tempOsmId: -2,
            externalId: 'uuid2',
          },
          {
            tempOsmId: -3,
            externalId: 'uuid3',
          },
          {
            tempOsmId: -4,
            externalId: 'uuid4',
          },
        ],
        osmMapping: [
          {
            tempOsmId: -1,
            osmId: 1,
          },
          {
            tempOsmId: -2,
            osmId: 2,
          },
          {
            tempOsmId: -3,
            osmId: 3,
          },
        ],
      };
      const response = await requestSender.merge(body);

      expect(response).toHaveProperty('status', httpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(response).toHaveProperty('body.message', "Can't find tempOsmId: -4");
    });

    it('should return 422 status code and duplicate id message', async function () {
      const body = {
        externalMapping: [
          {
            tempOsmId: -1,
            externalId: 'uuid1',
          },
          {
            tempOsmId: -2,
            externalId: 'uuid2',
          },
          {
            tempOsmId: -3,
            externalId: 'uuid3',
          },
        ],
        osmMapping: [
          {
            tempOsmId: -1,
            osmId: 1,
          },
          {
            tempOsmId: -2,
            osmId: 2,
          },
          {
            tempOsmId: -3,
            osmId: 3,
          },
          {
            tempOsmId: -3,
            osmId: 4,
          },
        ],
      };
      const response = await requestSender.merge(body);

      expect(response).toHaveProperty('status', httpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(response).toHaveProperty('body.message', 'Duplicate tempOsmId: -3');
    });
  });
});
