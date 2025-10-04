import { StringValue } from "@schorts/shared-kernel";

const MIN_LENGTH = 1;

export default class CompanyValue extends StringValue {
  attributeName = "Company";

  constructor(value) {
    super(value, MIN_LENGTH);
  }
}
