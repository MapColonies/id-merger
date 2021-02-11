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

@injectable()
export class MergeManager {
  public merge = (jsonId: MergedIdMapping): MergedModel[] => {
    const hash = this.createHash(jsonId);
    const merged = jsonId.externalMapping.map((externalElm) => {
      const osmId = hash[externalElm.tempOsmId];
      if (osmId === undefined) {
        throw new Error(`Can't find tempOsmId: ${externalElm.tempOsmId}`);
      }
      return { externalId: externalElm.externalId, osmId };
    });
    return merged;
  };

  private readonly createHash = (jsonId: MergedIdMapping): Partial<Record<number, number>> => {
    const hash: Partial<Record<number, number>> = {};
    jsonId.osmMapping.forEach((osmElem) => {
      if (hash[osmElem.tempOsmId] !== undefined) {
        throw new Error(`Duplicate tempOsmId: ${osmElem.tempOsmId}`);
      }
      hash[osmElem.tempOsmId] = osmElem.osmId;
    });
    return hash;
  };
}

export { ExternalMappingModel, OsmMappingModel, MergedModel, MergedIdMapping };
