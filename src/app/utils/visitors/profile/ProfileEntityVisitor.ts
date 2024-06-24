import { Entity } from "@/app/models/entity";
import { IXMLVisitor } from "@/app/models/IXMLVisitor";
import { ProfileEntityAttributeVisitor } from "./ProfileEntityAttributeVisitor";

export class ProfileEntityVisitor implements IXMLVisitor {
    private attributeVisitor: ProfileEntityAttributeVisitor;

    constructor(attributeVisitor: ProfileEntityAttributeVisitor) {
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