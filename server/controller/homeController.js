const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const util = require("../modules/util");
const { praise } = require('../models/index');
const homeService = require("../service/homeService");

module.exports = {
  // 홈 화면
  praiseHome: async (req, res) => {
    let { praiseId } = req.params;

    if (praiseId === undefined) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    } 

    try {
      const maxPraiseId = await praise.max('id');
      
      if (praiseId > maxPraiseId) {
        praiseId = praiseId - maxPraiseId;
      }

      const homePraise = await homeService.homePraise(praiseId);

      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.USER_HOME_SUCCESS, {
        homePraise
      }));
    } catch (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
  }
}