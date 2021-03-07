const { user } = require('../models/index');

module.exports = {
  nickNameCheck: async (nickName) => {
    try {
      const userNickNameCheck = await user.findOne({
        where: {
          nickName: nickName
        }
      });
      return userNickNameCheck;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}