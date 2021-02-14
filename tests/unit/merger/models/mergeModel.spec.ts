import { MergeManager } from '../../../../src/merger/models/mergerManager';

let mergeManager: MergeManager;

describe('mergeManager', () => {
  beforeEach(function () {
    mergeManager = new MergeManager();
  });
  describe('#merge', () => {
    it('return the merged json', function () {
      const jsonId = {
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
      const merged = [
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

      const result = mergeManager.merge(jsonId);

      expect(result).toEqual(merged);
    });

    it('throw error for not found tempOsmId', function () {
      const jsonId = {
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

      expect(() => mergeManager.merge(jsonId)).toThrow(new Error("Can't find tempOsmId: -4"));
    });

    it('throw error for duplicate tempOsmId', function () {
      const jsonId = {
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
            osmId: 30,
          },
        ],
      };

      expect(() => mergeManager.merge(jsonId)).toThrow(new Error('Duplicate tempOsmId: -3'));
    });
  });
});
