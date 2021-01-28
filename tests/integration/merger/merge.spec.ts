import httpStatusCodes from 'http-status-codes';
import { container } from 'tsyringe';
import { IMergedModel } from '../../../src/merger/models/mergerManager';

import { registerTestValues } from '../testContainerConfig';
import * as requestSender from './helpers/requestSender';

describe('resourceName', function () {
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

      expect(response.status).toBe(httpStatusCodes.OK);

      const merged = response.body as IMergedModel;

      expect(merged).toEqual(expected);
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

      expect(response.status).toBe(httpStatusCodes.UNPROCESSABLE_ENTITY);

      const merged = response.body as Error;

      expect(merged.message).toEqual("Can't find tempOsmId: -4");
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

      expect(response.status).toBe(httpStatusCodes.UNPROCESSABLE_ENTITY);

      const merged = response.body as Error;

      expect(merged.message).toEqual('Duplicate tempOsmId: -3');
    });
  });
});
