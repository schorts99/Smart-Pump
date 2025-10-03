import { EntityRegistry } from "@schorts/shared-kernel/entities";

export default class LowDBEntityFactory {
  #collectionName;
  
  constructor(collectionName) {
    this.#collectionName = collectionName;
  }

  fromRecord(record) {
    const { _id, ...rest } = record;

    return EntityRegistry.create(this.#collectionName, { id: _id, ...rest });
  }

  fromRecords(records) {
    return records.map((r) => this.fromRecord(r));
  }
}
