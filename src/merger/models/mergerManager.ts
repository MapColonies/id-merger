import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';

interface ExternalMappingModel {
  tempOsmId: number;
  externalId: string;
}

interface OsmMappingModel {
  tempOsmId: number;
  osmId: number;
}

interface MergedModel {
  externalId: string;
  osmId: number;
}

interface MergedIdMapping {
  externalMapping: ExternalMappingModel[];
  osmMapping: OsmMappingModel[];
}

@injectable()
export class MergeManager {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger) {}

  public merge = (mergedIdMapping: MergedIdMapping): MergedModel[] => {
    this.logger.info({
      msg: 'starting id merging',
      externalIdAmount: mergedIdMapping.externalMapping.length,
      osmIdAmount: mergedIdMapping.osmMapping.length,
    });

    const osmIdToTempIdMap = this.createIdMapping(mergedIdMapping.osmMapping);

    const merged = mergedIdMapping.externalMapping.map((externalElement) => {
      const osmId = osmIdToTempIdMap.get(externalElement.tempOsmId);
      if (osmId === undefined) {
        this.logger.error({
          msg: 'merge failed. could not find osmId with tempOsmId for externalId',
          tempOsmId: externalElement.tempOsmId,
          externalId: externalElement.externalId,
        });

        throw new Error(`can't find tempOsmId: ${externalElement.tempOsmId}`);
      }

      return { externalId: externalElement.externalId, osmId };
    });

    return merged;
  };

  private readonly createIdMapping = (osmMapping: OsmMappingModel[]): Map<number, number> => {
    const map = new Map<number, number>();

    osmMapping.forEach((osmElement) => {
      if (map.get(osmElement.tempOsmId) !== undefined) {
        this.logger.error({ msg: 'merge failed. received duplicate tempOsmId', tempOsmId: osmElement.tempOsmId });

        throw new Error(`duplicate tempOsmId: ${osmElement.tempOsmId}`);
      }
      map.set(osmElement.tempOsmId, osmElement.osmId);
    });

    return map;
  };
}

export { ExternalMappingModel, OsmMappingModel, MergedModel, MergedIdMapping };
