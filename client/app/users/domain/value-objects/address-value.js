import { StringValue } from "@schorts/shared-kernel";

const MIN_LENGTH = 1;

export default class AddressValue extends StringValue {
  attributeName = "Address";

  constructor(value) {
    super(value, MIN_LENGTH);
  }
}
