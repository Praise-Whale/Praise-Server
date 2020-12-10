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

    const { nickName, userLevel } = userHomeTap[0];

    // console.log(userHomeTap[0].dataValues.whaleName);
    // console.log(JSON.parse(JSON.stringify(userHomeTap[0])));
    // console.log(whaleName);
    // console.log(nickName);

    const homeTapInfo = {
      nickName: nickName,
      whaleName: userHomeTap[0].dataValues.whaleName,
      userLevel: userLevel,
      praiseCount: userHomeTap[0].dataValues.praiseCount
    }

    switch(userLevel) {
      case 0:
        homeTapInfo.praiseNeedCount = 5 - userHomeTap[0].dataValues.praiseCount;
        break;
      case 1:
        homeTapInfo.praiseNeedCount = 10 - userHomeTap[0].dataValues.praiseCount;
        break;
      case 2:
        homeTapInfo.praiseNeedCount = 30 - userHomeTap[0].dataValues.praiseCount;
        break;
      case 3:
        homeTapInfo.praiseNeedCount = 50 - userHomeTap[0].dataValues.praiseCount;
        break;
      case 4:
        homeTapInfo.praiseNeedCount = 100 - userHomeTap[0].dataValues.praiseCount;
        break;
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.USER_HOME_SUCCESS, homeTapInfo));
    return;
  }
}