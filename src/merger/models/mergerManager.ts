import { injectable } from 'tsyringe';

interface IExternalMappingModel {
  tempOsmId: number;
  externalId: string;
}

interface IOsmMappingModel {
  tempOsmId: number;
  osmId: number;
}

interface IMergedModel {
  externalId: string;
  osmId: number;
}

interface IJsonId {
  externalMapping: IExternalMappingModel[];
  osmMapping: IOsmMappingModel[];
}

@injectable()
export class MergeManager {
  public merge = (jsonId: IJsonId): IMergedModel[] => {
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

  private readonly createHash = (jsonId: IJsonId): Partial<Record<number, number>> => {
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

export { IExternalMappingModel, IOsmMappingModel, IMergedModel, IJsonId };
