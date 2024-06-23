import * as xmlJs from 'xml-js';
import { Entity, Attribute } from "../models/entity";

interface IXMLVisitor {
  visitEntity(entity: any): Entity;
  processAttributes(entity: any, processedEntity: Entity): void;
}

class EntityVisitor implements IXMLVisitor {
  private attributeVisitor: EntityAttributeVisitor;

  constructor(attributeVisitor: EntityAttributeVisitor) {
    this.attributeVisitor = attributeVisitor;
  }

  visitEntity(entity: any): Entity {
    const processedEntity: Entity = {
      name: entity._attributes.name,
      instanceid: entity._attributes.instanceid,
      attributes: []
    };
    this.processAttributes(entity, processedEntity);
    return processedEntity;
  }

  processAttributes(entity: any, processedEntity: Entity) {
    processedEntity.attributes = this.attributeVisitor.visitEntityAttribute(entity.attribute);
  }
}

class EntityAttributeVisitor {
  visitEntityAttribute(attribute: any): Attribute[] {
    return attribute ? (Array.isArray(attribute) ? attribute : [attribute]).map(attr => this.visitStringAttribute(attr)) : [];
  }

  visitStringAttribute(attr: any): Attribute {
    const values = Array.isArray(attr.value) ? attr.value.map((v: { _text: string; }) => v._text) : attr.value ? [attr.value._text] : attr._text ? [attr._text] : [];
    return {
      name: attr._attributes.name.split('.').pop(),
      value: values,
      source: attr._attributes.source,
    };
  }
}

const parseXMLFile = (xml: string): Promise<Entity[]> => {
  return new Promise((resolve, reject) => {
    try {
      const result = xmlJs.xml2js(xml, { compact: true }) as any;
      if (!result.profile || !result.profile.entity) {
        throw new Error("Invalid XML structure: Missing 'profile' or 'entity'.");
      }

      const attributeVisitor = new EntityAttributeVisitor();
      const entityVisitor = new EntityVisitor(attributeVisitor);

      const entities: Entity[] = result.profile.entity.map((entity: any) => entityVisitor.visitEntity(entity));

      resolve(entities);
    } catch (error) {
      reject(error);
    }
  });
};

export { parseXMLFile };