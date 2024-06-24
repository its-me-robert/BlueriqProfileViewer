import { Attribute } from "@/app/models/entity";
import { isUUID } from "../../utils";

export class AggregateEntityAttributeVisitor {
    visitEntityAttribute(attributes: any[]): Attribute[] {
        return attributes.map(attr => this.visitAttribute(attr));
    }

    private visitAttribute(attr: any): Attribute {
        const attrName = attr._attributes.name;
        const isMultiValue = attr._attributes.multivalue === "true";
        let values: string[] = [];

        if (isMultiValue && attr.value) {
            values = attr.value.map((v: any) => v._text || v);
        } else if (!isMultiValue && attr._text) {
            values = [attr._text];
        }
        
        const source = values.length > 0 && isUUID(values[0]) ? "RELATION" : "ATTRIBUTE";

        return {
            name: attrName,
            value: values,
            source: source,
        };
    }
}