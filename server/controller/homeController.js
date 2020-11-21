const crypto = require("crypto");
const util = require("../modules/util");
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const { praise } = require("../models");

module.exports = {
  home: async (req, res) => {
    //1. 전체에서 name 하나 출력하기
    try {
      const name = await praise.findAll();
      //2. 칭찬을 random하게 구성하기
      const praiseResult = name
        .map((a) => [Math.random(), a])
        .sort((a, b) => a[0] - b[0])
        .map((a) => a[1]);
    

        console.log(praiseResult);
      //3. status: 200, message: id, daily_praise, mission_praise 반환
      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.READ_HOME, {
            id: praiseResult[0].id,
            daily_praise: praiseResult[0].daily_praise,
            mission_praise: praiseResult[0].mission_praise,
        })
      );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.USER_READ_ALL_FAIL
          )
        );
    }
  },
};
