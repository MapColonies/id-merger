import { Logger } from '@map-colonies/js-logger';
import { contexBindingHelper } from '@map-colonies/telemetry';
import { SpanStatusCode, Tracer } from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { inject, injectable } from 'tsyringe';
import { Services } from '../../common/constants';

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
  public constructor(@inject(Services.LOGGER) private readonly logger: Logger, @inject(Services.TRACER) private readonly tracer: Tracer) {}

  public merge = (mergedIdMapping: MergedIdMapping): MergedModel[] => {
    const span = this.tracer.startSpan('merge entities', { attributes: { [SemanticAttributes.CODE_FUNCTION]: 'merge' } });

    const tempIdMap = contexBindingHelper(span, this.createIdMapping)(mergedIdMapping);

    const merged = mergedIdMapping.externalMapping.map((externalElm) => {
      const osmId = tempIdMap.get(externalElm.tempOsmId);
      if (osmId === undefined) {
        this.logger.error({ msg: 'Cant find externalMapping entity in osmMapping', entity: externalElm });
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Not found entity' });
        span.end();
        throw new Error(`Can't find tempOsmId: ${externalElm.tempOsmId}`);
      }
      return { externalId: externalElm.externalId, osmId };
    });
    span.end();
    return merged;
  };

  public createIdMapping = (mergedIdMapping: MergedIdMapping): Map<number, number> => {
    const span = this.tracer.startSpan('create id mapping', { attributes: { [SemanticAttributes.CODE_FUNCTION]: 'createIdMapping' } });

    const map = new Map<number, number>();
    mergedIdMapping.osmMapping.forEach((osmElem) => {
      if (map.get(osmElem.tempOsmId) !== undefined) {
        this.logger.error({ msg: 'Duplicate tempOsmId', tempOsmId: osmElem.tempOsmId });
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Duplicate tempOsmId' });
        span.end();
        throw new Error(`Duplicate tempOsmId: ${osmElem.tempOsmId}`);
      }
      map.set(osmElem.tempOsmId, osmElem.osmId);
    });
    span.end();
    return map;
  };
}

export { ExternalMappingModel, OsmMappingModel, MergedModel, MergedIdMapping };
