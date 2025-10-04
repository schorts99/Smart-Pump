import { Result, ValuesNotValid } from "@schorts/shared-kernel";

import CompanyValue from "../../../domain/value-objects/company-value/index.js";
import AddressValue from "../../../domain/value-objects/address-value/index.js";
import CompanyNotValid from "../../../domain/exceptions/company-not-valid/index.js";
import AddressNotValid from "../../../domain/exceptions/address-not-valid/index.js";
import User from "../../../domain/entities/user/index.js";

import NotAuthenticated from "../../../../../shared/exceptions/not-authenticated/index.js";

export default class CurrentUserPatcher {
  #authProvider;
  #userDAO;
  
  constructor(authProvider, userDAO) {
    this.#authProvider = authProvider;
    this.#userDAO = userDAO;
  }

  async patch(token, company, address) {
    if (!(await this.#authProvider.isAuthenticated(token))) {
      return Result.error(new NotAuthenticated());
    }

    const companyValue = new CompanyValue(company);
    const addressValue = new AddressValue(address);
    const errors = [];

    if (!companyValue.isValid) {
      errors.push(new CompanyNotValid(`Length must be of at least ${companyValue.minLength}`));
    }

    if (!addressValue.isValid) {
      errors.push(new AddressNotValid(`Length must be of at least ${addressValue.minLength}`));
    }

    if (errors.length > 0) {
      return Result.error(new ValuesNotValid(errors));
    }

    const currentUser = await this.#authProvider.currentUser(token);
    const updatedCurrentUser = User.fromPrimitives({
      ...currentUser.toPrimitives(),
      company,
      address,
    });
    
    await this.#userDAO.update(updatedCurrentUser);

    return Result.success(updatedCurrentUser);
  }
}
