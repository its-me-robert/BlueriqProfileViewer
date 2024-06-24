import { Entity } from "./entity";

export interface IXMLVisitor {
    visitEntity(entity: any): Entity;
    processAttributes(entity: any, processedEntity: Entity): void;
}