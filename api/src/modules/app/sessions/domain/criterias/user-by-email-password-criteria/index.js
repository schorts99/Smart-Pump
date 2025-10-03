import { Criteria } from "@schorts/shared-kernel";

export default class UserByEmailPasswordCriteria extends Criteria {
  constructor(email, password) {
    super();

    super
      .where("email", "EQUAL", email)
      .where("password", "EQUAL", password);
  }
}
