export default class CompanyNotValid extends Error {
  attributeName = "company";
  
  constructor(message) {
    super(message);
  }
}
