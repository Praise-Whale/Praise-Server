const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const util = require("../modules/util");
const { user } = require('../models/index');
const jwt = require('../modules/jwt');

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
      userLevel: 1,
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
    
  }
}