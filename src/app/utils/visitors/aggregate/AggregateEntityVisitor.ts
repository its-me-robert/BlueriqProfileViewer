import { Entity } from "@/app/models/entity";
import { IXMLVisitor } from "@/app/models/IXMLVisitor";
import { AggregateEntityAttributeVisitor } from "./AggregateEntityAttributeVisitor";

export class AggregateEntityVisitor implements IXMLVisitor {
    private attributeVisitor: AggregateEntityAttributeVisitor;

    constructor(attributeVisitor: AggregateEntityAttributeVisitor) {
        this.attributeVisitor = attributeVisitor;
    }

    visitEntity(entity: any): Entity {
        const processedEntity: Entity = {
            name: entity._attributes.type,
            instanceid: entity._attributes.id,
            attributes: []
        };
        this.processAttributes(entity, processedEntity);
        return processedEntity;
    }

    processAttributes(entity: any, processedEntity: Entity) {
        // Ensure entity.attribute and entity.relation are arrays (or empty arrays if undefined)
        const attributes = Array.isArray(entity.attribute) ? entity.attribute : entity.attribute ? [entity.attribute] : [];
        const relations = Array.isArray(entity.relation) ? entity.relation : entity.relation ? [entity.relation] : [];

        // Concatenate attributes and relations arrays
        processedEntity.attributes = this.attributeVisitor.visitEntityAttribute([...attributes, ...relations]);
    }
}