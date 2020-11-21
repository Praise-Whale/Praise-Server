const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");
const { User } = require("../models");
const { userService } = require("../service");
const jwt = require('../modules/jwt');

module.exports = {
  signup: async (req, res) => {
    const { email, password, userName } = req.body;

    if (!email || !password || !userName) {
      console.log("필요한 값이 없습니다");
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const alreadyEmail = await userService.emailCheck(email);

      if (alreadyEmail) {
        console.log("이미 존재하는 이메일 입니다");
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_ID));
      }

      const user = await userService.signup(email, userName, password);

      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SIGN_IN_SUCCESS, {
          id: user.id,
          email,
          userName,
        })
      );
    } catch (err) {
      console.error(err);
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMessage.SIGN_IN_FAIL));
    }
  },
  signin: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("필요한 값이 없습니다!");
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const alreadyEmail = await userService.emailCheck(email);
      
      if (!alreadyEmail) {
        console.log("없는 이메일 입니다.");
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_EMAIL));
      }

      const { salt, password: hashedPassword } = alreadyEmail;
      const user = await userService.signin(email, password, salt);

      if (!user) {
        console.log("비밀번호가 일치하지 않습니다.");
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_PW));
      }
      console.log(user);

      const { accessToken, refreshToken } = await jwt.sign(user);
      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SIGN_IN_SUCCESS, {
          accessToken,
          refreshToken,
        })
      );
    } catch (error) {
      console.error(error);
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMessage.SIGN_IN_FAIL));
    }
  },
  getProfile: async (req, res) => {
    const { id } = req.decoded;
    console.log(req.decoded);
    try {
      const user = await User.findOne({ where : { id }, attributes: ['id', 'userName', 'email']});
      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_PROFILE_SUCCESS, user));
    } catch(err) {
      console.log(err);
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.USER_READ_ALL_FAIL));    
    }
  }
};
