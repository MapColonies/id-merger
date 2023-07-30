import jsLogger from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import httpStatusCodes from 'http-status-codes';
import { getApp } from '../../../src/app';
import { Services } from '../../../src/common/constants';
import { MergerRequestSender } from './helpers/requestSender';

describe('merge', function () {
  let requestSender: MergerRequestSender;
  beforeEach(function () {
    const app = getApp({
      override: [
        { token: Services.LOGGER, provider: { useValue: jsLogger({ enabled: false }) } },
        { token: Services.TRACER, provider: { useValue: trace.getTracer('testTracer') } },
      ],
      useChild: true,
    });
    requestSender = new MergerRequestSender(app);
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
      expect(response).toHaveProperty('body.message', "can't find tempOsmId: -4");
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
      expect(response).toHaveProperty('body.message', 'duplicate tempOsmId: -3');
    });
  });
});
