
export default class EntityLowDBFactory {
  static fromEntity(entity) {
    const data = entity.toPrimitives();
    const { id, ...rest } = data;

    return { _id: id, ...rest };
  }
}
