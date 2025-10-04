import { Result, ValuesNotValid } from "@schorts/shared-kernel";

import { CURRENT_USER_URL } from "../../../api-routes";

import CompanyValue from "../../domain/value-objects/company-value";
import AddressValue from "../../domain/value-objects/address-value";
import CompanyNotValid from "../../domain/exceptions/company-not-valid";
import AddressNotValid from "../../domain/exceptions/address-not-valid";
import User from "../../domain/entities/user";

export default class UserPatcher {
  #jsonAPIConnector;
  
  constructor(jsonAPIConnector) {
    this.#jsonAPIConnector = jsonAPIConnector;
  }
  
  async patch(id, company, address) {
    const companyValue = new CompanyValue(company);
    const addressValue = new AddressValue(address);
    const errors = [];

    if (!companyValue.isValid) {
      errors.push(new CompanyNotValid(`Length must be of at least ${companyValue.minLength}`));
    }

    if (!addressValue.isValid) {
      errors.push(new AddressNotValid(`Length must be of at least ${addressValue.minLength}`));
    }

    if (errors.length) {
      return Result.error(new ValuesNotValid(errors));
    }

    const { data: { attributes } } = await this.#jsonAPIConnector.update(
      CURRENT_USER_URL,
      {
        id,
        type: "users",
        attributes: {
          company,
          address,
        },
      },
    );

    return Result.success(User.fromPrimitives({ id, ...attributes }));
  }
}
