const statusCode = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const util = require('../modules/util');
const { user, praise, praiseTarget, sequelize } = require('../models/index');

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
    });

    const toastMsgResult = await praiseTarget.findAll({
      attributes: [[sequelize.fn('COUNT', sequelize.col('praiseTarget.id')), 'toastCount']],
      where: {
        userId: userIdx
      } 
    });

    const { toastCount } = toastMsgResult[0].dataValues;

    levelCheck = false;

    if (toastCount == 5 || toastCount == 10 || toastCount == 30 || toastCount == 50 || toastCount == 100) {
      levelCheck = true;
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PRAISERUP_SUCCESS, {
      toastCount,
      levelCheck
    }));
},

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
  praiseYearMonth: async (req, res) => {
    const userIdx = req.userIdx;
    const { year, month } = req.params;

    try {
      const praiseCountResult = await sequelize.query(`
      SELECT COUNT(id) as praiseCount
      FROM praiseTarget
      where created_at LIKE '%${year}%' and created_at LIKE '%-${month}-%'`);

      const yearMonthPraise = await sequelize.query(`
      SELECT praisedName, today_praise
      FROM praiseTarget
      JOIN praise ON praiseTarget.praiseId = praise.id
      Where created_at LIKE '%${year}%' and created_at LIKE '%-${month}-%';
      `);

      const praiseCount = praiseCountResult[0];
      const collectionPraise = yearMonthPraise[0];
  
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PRAISE_YEAR_MONTH_COLLECTION, {
        praiseCount,
        collectionPraise
      }));
      return;
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  },
  praiseRanking: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const praiseCountResult = await sequelize.query(`
      SELECT COUNT(DISTINCT praisedName) as totalPraiserCount
      FROM praiseTarget`);

      const totalPraiserCount = praiseCountResult[0];

      const rankingCountResult = await praiseTarget.findAll({
        attributes: ['praisedName', [sequelize.fn('COUNT', sequelize.col('praiseTarget.praisedName')), 'praiserCount']],
        group: ['praiseTarget.praisedName'],
        raw: true,
        order: sequelize.literal('praiserCount DESC'),
        limit: 5
      });
  
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PRAISE_RANKING_SUCCESS, {
        totalPraiserCount,
        rankingCountResult
      }));
      return;
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  }
}