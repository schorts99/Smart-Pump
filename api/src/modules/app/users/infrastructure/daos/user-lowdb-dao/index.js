import LowDBDAO from "../../../../../shared/lowdb/lowdb-dao/index.js";

export default class UserLodDBDAO extends LowDBDAO {
  constructor(lowDB) {
    super("users", lowDB)
  }
}
