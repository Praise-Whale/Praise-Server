const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const util = require("../modules/util");
const { user, praiseTarget } = require('../models/index');
const jwt = require('../modules/jwt');
const sequelize = require('sequelize');
const userService = require('../service/userService');

module.exports = {
  signup: async (req, res) => {
    const { nickName, whaleName } = req.body;

    if (!nickName || !whaleName) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    const nickNameCheck = await userService.nickNameCheck(nickName);

    if (nickNameCheck) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_NICKNAME));
      return;
    }

    const userResult = await userService.signUp(nickName, whaleName);

    const { id } = userResult;

    const { accessToken, refreshToken } = await jwt.sign(id);
    
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SIGNUP_SUCCESS, {
      accessToken: accessToken,
      refreshToken: refreshToken
    }))
  },

  nickNameCheck: async (req, res) => {
    const { nickName } = req.params;

    if (!nickName) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    const nickNameCheck = await userService.nickNameCheck(nickName);

    if (nickNameCheck) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_NICKNAME));
      return;
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.POSSIBLE_NICKNAME));
    return;
  },

  signin: async (req, res) => {
    const { nickName } = req.body;

    if (!nickName) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    const nickNameCheck = await userService.signIn(nickName);

    if (!nickNameCheck) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOT_FOUND_USER))
      return;
    }

    const { id } = nickNameCheck;

    const { accessToken, refreshToken } = await jwt.sign(id);
    
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SINGIN_SUCCESS, {
      accessToken: accessToken,
      refreshToken: refreshToken
    }))
  },

  userHome: async (req, res) => {
    const userIdx = req.userIdx;
    
    const userHomeTap = await user.findAll({
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

    const { nickName, whaleName, userLevel, praiseCount } = userHomeTap[0].dataValues;
    
    const homeTapInfo = {
      nickName: nickName,
      whaleName: whaleName,
      userLevel: userLevel,
      praiseCount: praiseCount
    }

    switch(userLevel) {
      case 0:
        homeTapInfo.levelUpNeedCount = 5;
        break;
      case 1:
        homeTapInfo.levelUpNeedCount = 10;
        break;
      case 2:
        homeTapInfo.levelUpNeedCount = 30;
        break;
      case 3:
        homeTapInfo.levelUpNeedCount = 50;
        break;
      case 4:
        homeTapInfo.levelUpNeedCount = 100;
        break;
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.USER_HOME_SUCCESS, homeTapInfo));
    return;
  },

  nickNameChange: async (req, res) => {
    const { newNickName } = req.body;
    const userIdx = req.userIdx;

    if(!newNickName) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    const nickNameCheck = await userService.nickNameCheck(newNickName);

    if (nickNameCheck) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_NICKNAME));
      return;
    }

    const userResult = await userService.nickNameChange(newNickName, userIdx);

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.NICKNAME_UPDATE_SUCCESS));
    return;
  },

  alaramCheck: async (req, res) => {
    const { alarmSet } = req.body;
    const userIdx = req.userIdx;

    if (alarmSet === undefined) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    const alarmUpdate = await userService.alarmUpdate(userIdx);

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.ALARM_UPDATE_SUCCESS));
    return;
  },
}