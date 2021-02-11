import { injectable } from 'tsyringe';

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

function createIdMapping(mergedIdMapping: MergedIdMapping): Map<number, number> {
  const map = new Map<number, number>();
  mergedIdMapping.osmMapping.forEach((osmElem) => {
    if (map.get(osmElem.tempOsmId) !== undefined) {
      throw new Error(`Duplicate tempOsmId: ${osmElem.tempOsmId}`);
    }
    map.set(osmElem.tempOsmId, osmElem.osmId);
  });
  return map;
}

@injectable()
export class MergeManager {
  public merge = (mergedIdMapping: MergedIdMapping): MergedModel[] => {
    const tempIdMap = createIdMapping(mergedIdMapping);
    const merged = mergedIdMapping.externalMapping.map((externalElm) => {
      const osmId = tempIdMap.get(externalElm.tempOsmId);
      if (osmId === undefined) {
        throw new Error(`Can't find tempOsmId: ${externalElm.tempOsmId}`);
      }
      return { externalId: externalElm.externalId, osmId };
    });
    return merged;
  };
}

export { ExternalMappingModel, OsmMappingModel, MergedModel, MergedIdMapping };
