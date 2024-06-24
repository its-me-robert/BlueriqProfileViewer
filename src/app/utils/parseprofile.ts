import * as xmlJs from 'xml-js';
import { Entity, Attribute } from "../models/entity";
import { ProfileEntityAttributeVisitor } from './visitors/profile/ProfileEntityAttributeVisitor';
import { ProfileEntityVisitor } from './visitors/profile/ProfileEntityVisitor';
import { AggregateEntityAttributeVisitor } from './visitors/aggregate/AggregateEntityAttributeVisitor';
import { AggregateEntityVisitor } from './visitors/aggregate/AggregateEntityVisitor';
import { isUUID } from './utils';

const parseXMLFile = (xml: string): Promise<Entity[]> => {
  return new Promise((resolve, reject) => {
    try {
      const result = xmlJs.xml2js(xml, { compact: true }) as any;
      let entities: Entity[] = [];

      if (result.profile) {
        const attributeVisitor = new ProfileEntityAttributeVisitor();
        const entityVisitor = new ProfileEntityVisitor(attributeVisitor);
        entities = result.profile.entity.map((entity: any) => entityVisitor.visitEntity(entity));
      } else if (result.aggregate) {
        // New logic for aggregate entities
        const attributeVisitor = new AggregateEntityAttributeVisitor();
        const entityVisitor = new AggregateEntityVisitor(attributeVisitor);
        // Assuming aggregate entities are structured similarly to profile entities
        entities = result.aggregate.entity.map((entity: any) => entityVisitor.visitEntity(entity));
        processRelationAttributes(entities);
      } else {
        throw new Error("Invalid XML structure: Missing 'profile' or 'aggregate'.");
      }

      resolve(entities);
    } catch (error) {
      reject(error);
    }
  });
};

function processRelationAttributes(entities: Entity[]) {
  const entityMap = new Map(entities.map(entity => [entity.instanceid, entity]));
  entities.forEach(entity => {
    entity.attributes.forEach(attribute => {
      attribute.value.forEach((value, index) => {
        if (isUUID(value)) {
          const relation = entityMap.get(value);
          if (relation) {
            // Update the value with the new format
            attribute.value[index] = `${relation.name}|${value}`;
          }
        }
      });
    });
  });
}

export { parseXMLFile };