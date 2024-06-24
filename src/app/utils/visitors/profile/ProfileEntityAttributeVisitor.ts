import { Attribute } from "@/app/models/entity";

export class ProfileEntityAttributeVisitor {
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