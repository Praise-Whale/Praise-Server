const { praiseTarget, isPraised, sequelize } = require('../models/index');

module.exports = {
  praiseHome: async (userIdx, praiseId) => {
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