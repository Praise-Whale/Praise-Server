const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const util = require("../modules/util");
const { user, praiseTarget } = require('../models/index');
const jwt = require('../modules/jwt');
const sequelize = require('sequelize');

module.exports = {
  signup: async (req, res) => {
    const { nickName, whaleName } = req.body;

    if (!nickName || !whaleName) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    const nickNameCheck = await user.findOne({
      where: {
        nickName: nickName
      }
    });

    if (nickNameCheck) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_NICKNAME));
      return;
    }

    const userResult = await user.create({
      nickName: nickName,
      whaleName: whaleName,
      userLevel: 0,
      alarmCheck: true
    });

    const { id } = userResult;

    const { accessToken, refreshToken } = await jwt.sign(id);
    
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SIGNUP_SUCCESS, {
      accessToken: accessToken,
      refreshToken: refreshToken
    }))
  },

  signin: async (req, res) => {
    const { nickName } = req.body;

    if (!nickName) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    const nickNameCheck = await user.findOne({
      where: {
        nickName: nickName
      }
    });

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

  alaramCheck: async (req, res) => {
    const { alarmSet } = req.body;
    const userIdx = req.userIdx;

    if (alarmSet === undefined) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    const alarmUpdate = await user.update({
      alarmCheck: alarmSet, 
    }, {
      where: {
        id: userIdx
      }
    });

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.ALARM_UPDATE_SUCCESS));
    return;
  }
}