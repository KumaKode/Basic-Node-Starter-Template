const CrudRepository = require("./crud-repository");
const { UserModel } = require("../models");

class UserRepository extends CrudRepository {
  constructor() {
    super(UserModel);
  }
}

module.exports = UserRepository;
