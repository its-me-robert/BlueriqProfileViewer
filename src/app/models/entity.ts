export class Entity {
  name: string;
  instanceid: string;
  attributes: Attribute[];

  constructor(name: string, instanceid: string, attributes: Attribute[]) {
    this.name = name;
    this.instanceid = instanceid;
    this.attributes = attributes;
  }
}

export class Attribute {
  name: string;
  source: string;
  value: string[];

  constructor(name: string, source: string, value: string[]) {
    this.name = name;
    this.source = source;
    this.value = value;
  }
}