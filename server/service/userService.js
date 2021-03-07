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
  },

  signUp: async (nickName, whaleName) => {
    try {
      const userSignUp = await user.create({
        nickName: nickName,
        whaleName: whaleName,
        userLevel: 0,
        alarmCheck: true
      });
      return userSignUp;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}