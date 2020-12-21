const statusCode = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const util = require('../modules/util');
const moment = require('moment');
const { user, praise, praiseTarget } = require('../models/index');
const sequelize = require('sequelize');

module.exports = {
  praiserUp: async (req, res) => {
    const userIdx = req.userIdx;
    const { praisedName } = req.body;
    const { praiseId } = req.params;
    
    if (!praisedName || !praiseId) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    await praiseTarget.create({
      praisedName: praisedName,
      praiseId: praiseId,
      userId: userIdx,
      created_at: moment().format('YYYY-MM-DD')
    });

    const praiserResult = await praiseTarget.findAll({
      attributes: [[sequelize.fn('COUNT', sequelize.col('praiseTarget.id')), 'praiseCount']],
      include: [{
        model: user,
        attributes: ['userLevel']
      }],
      where: {
        userId: userIdx
      } 
    });

    const { praiseCount } = praiserResult[0].dataValues;
    const { userLevel } = praiserResult[0].dataValues.user

    levelUpCheck = false;
    
    const praiser_success = {
      levelUpCheck,
      userLevel
    }

    if (praiseCount == 5 || praiseCount == 10 || praiseCount == 30 || praiseCount == 50 || praiseCount == 100) {
      success_result.levelUpCheck = true;
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PRAISERUP_SUCCESS, praiser_success));
},

  praiseTarget: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const praiseUsers = await praiseTarget.findAll({
        attributes: ['praisedName'],
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
    const { year, month } = req.query;

    if (!year || !month) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }
    
    try {
      const collectionPraise = await praiseTarget.findAll({
        attributes: ['praisedName', 'created_at'],
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

      const { created_at } = collectionPraise[0].dataValues;
      console.log(created_at);


      const userNickName = await user.findAll({
        attributes: ['nickName'],
        where: {
          id: userIdx
        }
      });

      const praiseCountResult = await praiseTarget.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('praiseTarget.id')), 'praiseCount']]
      });

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
  },
}