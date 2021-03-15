const { user, praiseTarget } = require('../models/index');
const sequelize = require('sequelize');

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

  signUp: async (nickName, whaleName, deviceToken) => {
    try {
      const userSignUp = await user.create({
        nickName: nickName,
        userLevel: 0,
        whaleName: whaleName,
        deviceToken: deviceToken,
        alarmCheck: true
      });
      return userSignUp;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  signIn: async (nickName) => {
    try {
      const userSignIn = await user.findOne({
        where: {
          nickName: nickName
        }
      });
      return userSignIn;
    } catch (err) {
      throw err;
    }
  },

  nickNameChange: async (nickName, userIdx) => {
    try {
      const nickNameChange = await user.update({
        nickName: nickName,
      }, {
        where: {
          id: userIdx
        }
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  alarmUpdate: async (userIdx) => {
    try {
      const updateAlarm = await user.update({
        alarmCheck: alarmSet, 
      }, {
        where: {
          id: userIdx
        }
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  userHomeTap: async (userIdx) => {
    try {
      const userHome = await user.findAll({
        group: 'users.id',
        attributes: ['nickName', 'whaleName', 'userLevel', [sequelize.fn('COUNT', sequelize.col('praiseTargets.id')), 'praiseCount']],
        where: {
          id: userIdx
        },
        include: [{
          model: praiseTarget,
          attributes: []
        }]
      });
      return userHome;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}