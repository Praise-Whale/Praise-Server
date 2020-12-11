const statusCode = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const util = require('../modules/util');
const { user, praise, praiseTarget } = require('../models/index');
const sequelize = require('sequelize');

module.exports = {
  praiseTarget: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const praiseUsers = await praiseTarget.findAll({
        attributes: ['name'],
        limit: 3,
        where: {
          userId: userIdx
        } 
      });
  
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LATELY_PRAISE_USER, praiseUsers));
      return;
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  },

  praiseCollection: async (req, res) => {
    const userIdx = req.userIdx;
    try {
      const collectionPraise = await praiseTarget.findAll({
        attributes: ['praisedName'],
        include: [{
          model: praise,
          attributes: ['today_praise']
        }, {
          model: user,
          attributes: [],
          where: {
            id: userIdx
          }
        }],
      });

      const userNickName = await user.findAll({
        attributes: ['nickName'],
        where: {
          id: userIdx
        }
      });

      const praiseCountResult = await praiseTarget.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('praiseTarget.id')), 'praiseCount']]
      })

      const { praiseCount } = praiseCountResult[0].dataValues;
      const { nickName } = userNickName[0];
  
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PRAISE_ALL_COLLECTION, {
        collectionPraise,
        nickName,
        praiseCount
      }));
      return;
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  }
}