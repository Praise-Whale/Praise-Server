const { praiseTarget } = require("../models");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const util = require("../modules/util");
const { userService } = require("../service");

module.exports = {
  /**
   * [GET] /users/praise => 최근 칭찬한 유저 3명 조회
   */
  praiseUsers: async (req, res) => {
    try {
      const usersPraise = await praiseTarget.findAll({
        limit: 3,
        attributes: ['name'],
        order: [["name", "DESC"]],
      });

      res
        .status(statusCode.OK)
        .send(
          util.success(statusCode.OK, responseMessage.PRAISE_USERS, usersPraise)
        );
    } catch (err) {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR
          )
        );
    }
  },

  userTarget: async (req, res) => {
    const { id, name } = req.body;

    if (!id || !name) {
      res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    try {
      const user = await praiseTarget.create({
        name,
        praiseId: id,
      });
      res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, responseMessage.PRAISE_USERS_ADD));
    } catch (err) {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR
          )
        );
      return;
    }
  },

  signup: async (req, res) => {
    const { loginId, password, userName } = req.body;

    if (!loginId || !password || !userName) {
      console.log("필요한 값이 없습니다!");
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      const alreadyLoginId = await userService.loginIdCheck(loginId);
      if (alreadyLoginId) {
        console.log("이미 존재하는 아이디 입니다.");
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_EMAIL)
          );
      }
      const user = await userService.signup(loginId, password, userName);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, responseMessage.SIGN_UP_SUCCESS));
    } catch (error) {
      console.error(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.SIGN_UP_FAIL
          )
        );
    }
  },
  signin: async (req, res) => {
    const { loginId, password } = req.body;
    if (!loginId || !password) {
      console.log("필요한 값이 없습니다!");
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const alreadyLoginId = await userService.loginIdCheck(loginId);
      if (!alreadyLoginId) {
        console.log("없는 이메일 입니다.");
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_EMAIL));
      }
      const { salt, password: hashedPassword } = alreadyLoginId;
      const user = await userService.signin(loginId, password, salt); // 로그인 로직

      if (!user) {
        console.log("비밀번호가 일치하지 않습니다.");
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_PW)
          );
      }
      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.SIGN_IN_SUCCESS)
      );
    } catch (error) {
      console.error(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.SIGN_IN_FAIL
          )
        );
    }
  },
};
