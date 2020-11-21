const crypto = require("crypto");
const { user } = require("../models");

module.exports = {
  loginIdCheck: async (loginId) => {
    try {
      const alreadyLoginId = await user.findOne({
        where: {
          loginId,
        },
      });
      return alreadyLoginId;
    } catch (err) {
      throw err;
    }
  },
  signup: async (loginId, password, userName) => {
    try {
      const salt = crypto.randomBytes(64).toString("base64");
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("base64");
      const users = await user.create({
        loginId,
        password: hashedPassword,
        salt,
        userName,
        userLevel: 1
      });
      return users;
    } catch (err) {
      throw err;
    }
  },
  signin: async (loginId, password, salt) => {
    try {
      const inputPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("base64");
      const users = await user.findOne({
        where: {
          loginId,
          password: inputPassword,
        },
      });
      return users;
    } catch (err) {
      throw err;
    }
  },
};
