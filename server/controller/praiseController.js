const statusCode = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const util = require('../modules/util');
const praise = require('../models/dao/praise');
const { praiseTarget, isPraised, sequelize } = require('../models/index');

module.exports = {
  // 칭찬한 사람 등록
  praiserUp: async (req, res) => {
    const userIdx = req.userIdx;
    const { praisedName } = req.body;
    const { praiseId } = req.params;

    if (!praisedName || !praiseId) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    const created_at = new Date();

    await praiseTarget.create({
      praisedName: praisedName,
      praiseId: praiseId,
      userId: userIdx,
      created_at: created_at
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
  // 최근 칭찬 3명 유저 조회
  latelyParaiseUsers: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const praiseUsers = await praise.latelyPraiseUsers(userIdx);
  
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LATELY_PRAISE_USER, praiseUsers));
      return;
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  },
  // 칭찬 카드 조회(전체 + 연도, 월별)
  praiseCollection: async (req, res) => {
    const userIdx = req.userIdx;
    const { year, month } = req.params;

    try {
      if (month === 0) {
        const monthPraiseCount = await praise.userMonthPraiseCount(year, userIdx);
        const whoalPraise = await praise.userWholePraise(year, userIdx);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PRAISE_ALL_COLLECTION, {
          monthPraiseCount,
          collectionPraise
        }));
      }

      const yearPraiseCount = await praise.userYearPraiseCount(year, month, userIdx);
  
      const collectionPraise = await praise.userYearWhoalPraise(year, month, userIdx);

      const praiseCount = yearPraiseCount[0].praiseCount;
      
      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PRAISE_ALL_COLLECTION, {
        praiseCount,
        collectionPraise
      }));

    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return; 
    }
  },

  // 칭찬 랭킹
  praiseRanking: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const praiseCountResult = await praise.userRanking(userIdx);
  
      const totalPraiserCount = praiseCountResult[0].praiseCount;

      const rankingCountResult = await praiseTarget.findAll({
        attributes: ['praisedName', [sequelize.fn('COUNT', sequelize.col('praiseTarget.praisedName')), 'praiserCount']],
        where: {
          userId: userIdx
        },
        group: ['praiseTarget.praisedName'],
        raw: true,
        order: sequelize.literal('praiserCount DESC'),
        limit: 5,
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
  },
  // 칭찬 대상별 칭찬 내역 부르기
  eachTargetPraise: async (req, res) => {
    const userIdx = req.userIdx;
    const { praisedName } = req.query;

    if (!praisedName) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    try {
      const rankingCountResult = await sequelize.query(`
      SELECT COUNT(praisedName) as praiseCount
      FROM praiseTarget
      where praisedName = '${praisedName}' and userId = ${userIdx};
      `);

      const [{ praiseCount }] = rankingCountResult[0];

      const targetPraise = await sequelize.query(`
      SELECT praisedName, created_at, today_praise
      FROM praiseTarget
      JOIN praise ON praiseTarget.praiseId = praise.id
      where praisedName = '${praisedName}' and userId = ${userIdx};
      `);

      const collectionPraise = targetPraise[0];

      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.EACH_PRAISE_SUCCESS, {
        praiseCount,
        collectionPraise
      }));
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  }
}