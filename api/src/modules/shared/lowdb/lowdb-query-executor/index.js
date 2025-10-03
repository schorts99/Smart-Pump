export default class LowdbCriteriaQueryExecutor {
  static execute(lowDB, collectionName, criteria) {
    const collection = lowDB.data?.[collectionName] ?? [];

    const filters = Object.entries(criteria.filters ?? {});
    let results = collection.filter((record) =>
      filters.every(([field, filter]) =>
        LowdbCriteriaQueryExecutor.#matches(record, field, filter)
      )
    );

    if (criteria.sort) {
      const { field, direction } = criteria.sort;
      const dbField = field === "id" ? "_id" : field;
      const multiplier = direction === "ASC" ? 1 : -1;

      results = results.sort((a, b) => {
        if (a[dbField] < b[dbField]) return -1 * multiplier;
        if (a[dbField] > b[dbField]) return 1 * multiplier;
        return 0;
      });
    }

    if (criteria.offset) {
      results = results.slice(criteria.offset);
    }

    if (criteria.limit) {
      results = results.slice(0, criteria.limit);
    }

    return results;
  }

  static #matches(record, field, filter) {
    const dbField = field === "id" ? "_id" : field;
    const actual = record[dbField];
    const { operator, value } = filter;

    switch (operator) {
      case "EQUAL":
        return actual === value;
      case "NOT_EQUAL":
        return actual !== value;
      case "GREATER_THAN":
        return actual > value;
      case "LESS_THAN":
        return actual < value;
      case "GREATER_THAN_OR_EQUAL":
        return actual >= value;
      case "LESS_THAN_OR_EQUAL":
        return actual <= value;
      case "IN":
        return Array.isArray(value) && value.includes(actual);
      case "NOT_IN":
        return Array.isArray(value) && !value.includes(actual);
      case "CONTAINS":
        return typeof actual === "string" && actual.includes(value);
      case "STARTS_WITH":
        return typeof actual === "string" && actual.startsWith(value);
      case "ENDS_WITH":
        return typeof actual === "string" && actual.endsWith(value);
      default:
        return false;
    }
  }
}
