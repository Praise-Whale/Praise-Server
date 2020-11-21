const { praiseTarget } = require('../models');
const statusCdoe = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const util = require('../modules/util');

module.exports = {

  /**
   * [GET] /users/praise => 최근 칭찬한 유저 3명 조회 
   */
  praiseUsers: async (req, res) => {
    try {
      const usersPraise = await praiseTarget.findAll({
        limit: 3,
        attributes: {
          exclude: ['id', 'praiseId'],
        },
        order: [
          ['name', 'DESC']
        ],
      })
      console.log(usersPraise);
      res.status(statusCdoe.OK).send(util.success(statusCdoe.OK, responseMessage.PRAISE_USERS, usersPraise));
    } catch (err) {
      res.status(statusCdoe.INTERNAL_SERVER_ERROR).send(util.fail(statusCdoe.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
  },

  userTarget: async (req, res) => {
    const { id, name } = req.body;

    if (!id || !name ) {
      res.status(statusCdoe.BAD_REQUEST).send(util.fail(statusCdoe.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    try {
      const user = await praiseTarget.create({
        name,
        praiseId: id,
      })
      res.status(statusCdoe.OK).send(util.success(statusCdoe.OK, responseMessage.PRAISE_USERS_ADD));
    } catch (err) {
      res.status(statusCdoe.INTERNAL_SERVER_ERROR).send(util.fail(statusCdoe.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }

    
  }
}