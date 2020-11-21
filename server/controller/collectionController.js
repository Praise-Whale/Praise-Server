const statusCode = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const util = require('../modules/util');
const { praise, praiseTarget, user } = require('../models');
const sequelize = require('sequelize');

module.exports = {
  collection: async (req, res) => {
    try {
      const praisResult = await praise.findAll({
        attributes: ['createdAt', 'daily_praise'],
        include:[{
          model: praiseTarget,
          required: 'false',
          attributes: ['name'],
        }]
      })
      
      const praiseCount = await user.findAll({
        attributes: [[sequelize.fn('COUNT', 'id'), 'likeCount']],
        include: [{
          model: praise,
          as: 'praiser',
          attributes: [], 
        }]
      })


      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.COLLECTION_PRAISE, {
        praisResult,
        praiseCount
      }));
      return;
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  }
}