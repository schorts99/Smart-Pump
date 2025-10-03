import { JSONFilePreset } from "lowdb/node"

import LowDBEntityFactory from "../lowdb-entity-factory/index.js";
import EntityLowDBFactory from "../entity-lowdb-factory/index.js";
import LowDBCriteriaQueryExecutor from "../lowdb-query-executor/index.js";

export default class LowdbDAO {
  #collectionName;
  #databasePath;
  #lowDBentityFactory;

  constructor(collectionName, databasePath) {
    this.#collectionName = collectionName;
    this.#databasePath = databasePath;
    this.lowDBEntityFactory = new LowDBEntityFactory(collectionName);
  }

  async findByID(id) {
    const lowDB = await JSONFilePreset(this.#databasePath, {});
    const collection = lowDB.data[this.#collectionName] ?? [];
    const record = collection.find((r) => r._id === id);

    return record ? this.lowDBEntityFactory.fromRecord(record) : null;
  }

  async findOneBy(criteria) {
    const lowDB = await JSONFilePreset(this.#databasePath, {});

    criteria.limitResults(1);

    const results = LowDBCriteriaQueryExecutor.execute(lowDB, this.#collectionName, criteria);

    return results.length > 0 ? this.lowDBEntityFactory.fromRecord(results[0]) : null;
  }

  async getAll() {
    const lowDB = await JSONFilePreset(this.#databasePath, {});
    const collection = lowDB.data?.[this.#collectionName] ?? [];

    return this.#lowDBentityFactory.fromRecords(collection);
  }

  async search(criteria) {
    const lowDB = await JSONFilePreset(this.#databasePath, {});
    const results = LowDBCriteriaQueryExecutor.execute(lowDB, this.#collectionName, criteria);

    return this.#lowDBentityFactory.fromRecords(results);
  }

  async create(entity, uow) {
    const lowDB = await JSONFilePreset(this.#databasePath, {});
    const record = EntityLowDBFactory.fromEntity(entity);

    if (uow) {
      uow.create(this.#collectionName, record);
    } else {
      lowDB.data[this.#collectionName] ??= [];
      lowDB.data[this.#collectionName].push(record);

      await lowDB.write();
    }

    return entity;
  }

  async update(entity, uow) {
    const lowDB = await JSONFilePreset(this.#databasePath, {});

    const record = EntityLowDBFactory.fromEntity(entity);

    if (uow) {
      uow.update(this.#collectionName, record);
    } else {
      const collection = lowDB.data[this.#collectionName];
      const index = collection.findIndex((r) => r._id === entity.id.value);
      collection[index] = record;

      await lowDB.write();
    }

    return entity;
  }

  async delete(entity, uow) {
    const lowDB = await JSONFilePreset(this.#databasePath, {});

    if (uow) {
      uow.delete(this.#collectionName, entity.id.value);
    } else {
      const collection = lowDB.data[this.#collectionName];
      lowDB.data[this.#collectionName] = collection.filter((r) => r._id !== entity.id.value);

      await lowDB.write();
    }

    return entity;
  }
}
