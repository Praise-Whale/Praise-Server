const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const util = require("../modules/util");
const { user, praise, praiseTarget } = require('../models/index');
const sequelize = require('sequelize');

module.exports = {
  // 홈 화면
  praiseHome: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const maxPraiseId = await praise.max('id');

      const praiseMainHome = await praiseTarget.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('praiseTarget.id')), 'praiseCount']],
        include: [{
        model: user,
          attributes: ['nickName'],
          where: {
            id: userIdx
          }
        }],
      });

      const { praiseCount } = praiseMainHome[0].dataValues;

      const homePraise = await praise.findOne({
        attributes: ['today_praise', 'praise_description'],
        where: {
          id: praiseCount + 1
        },
      });

      for (let i = 0; i < maxPraiseId; i++) {
        if (praise.id > maxPraiseId) {
          continue;
        }
        praise.id = 1;
      }

      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.USER_HOME_SUCCESS, {
        homePraise
      }));
      return;
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  }
}