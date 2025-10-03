import { Entity } from "@schorts/shared-kernel";

export default class User extends Entity {
  guid;
  isActive;
  balance;
  picture;
  age;
  eyeColor;

  constructor(
    id,
    guid,
    isActive,
    balance,
    picture,
    age,
    eyeColor,
    name,
    company,
    email,
    password,
    phone,
    address
  ) {
    super(id);

    this.guid = guid;
    this.isActive = isActive;
    this.balance = balance;
    this.picture = picture;
    this.age = age;
    this.eyeColor = eyeColor;
    this.name = name;
    this.company = company;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.address = address;
  }

  toPrimitives() {
    return {
      id: this.id,
      guid: this.guid,
      isActive: this.isActive,
      balance: this.balance,
      picture: this.picture,
      age: this.age,
      eyeColor: this.eyeColor,
      name: this.name,
      company: this.company,
      email: this.email,
      password: this.password,
      phone: this.phone,
      address: this.address,
    }
  }
  
  static fromPrimitives(model) {
    return new User(
      model.id,
      model.guid,
      model.isActive,
      model.balance,
      model.picture,
      model.age,
      model.eyeColor,
      model.name,
      model.company,
      model.email,
      model.password,
      model.phone,
      model.address,
    );
  }
}
