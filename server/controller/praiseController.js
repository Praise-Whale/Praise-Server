const statusCode = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const util = require('../modules/util');
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
    

    // await isPraised.create({
    //   is_praised: true,
    //   created_at: created_at,
    //   userId: userIdx,
    //   praiseId: praiseId
    // });
  

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
      const praiseUsers = await sequelize.query(`
      SELECT distinct praisedName FROM praiseTarget WHERE userId = ${userIdx} LIMIT 3
      `);
      // const praiseUsers = await praiseTarget.findAll({
      //   attributes: ['praisedName'],
      //   limit: 3,
      //   where: {
      //     userId: userIdx
      //   } 
      // });
  
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LATELY_PRAISE_USER, praiseUsers[0]));
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

    if (month == 0) { // 올해의 칭찬 카드 전체 조회
      try {
        const praiseCountResult = await sequelize.query(`
        SELECT COUNT(id) as praiseCount
        FROM praiseTarget
        where created_at LIKE '%${year}%' and userId = ${userIdx}`);

        const wholePraise = await sequelize.query(`
        SELECT praisedName, created_at, today_praise
        FROM praiseTarget
        JOIN praise ON praiseTarget.praiseId = praise.id
        where created_at LIKE '%${year}%' and userId = ${userIdx};
        `);

        const [{ praiseCount }] = praiseCountResult[0];
        const collectionPraise = wholePraise[0];

        res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PRAISE_ALL_COLLECTION, {
          praiseCount,
          collectionPraise
        }));
        return;
      } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
        return;
      }
    }
  else { // 연도, 월별 조회
    try {
      const praiseCountResult = await sequelize.query(`
      SELECT COUNT(id) as praiseCount
      FROM praiseTarget
      where created_at LIKE '%${year}%' and created_at LIKE '%-${month}%'
      and userId = ${userIdx}`);

      const yearMonthPraise = await sequelize.query(`
      SELECT praisedName, created_at, today_praise
      FROM praiseTarget
      JOIN praise ON praiseTarget.praiseId = praise.id
      Where created_at LIKE '%${year}%' and created_at LIKE '%-${month}%'
      and userId = ${userIdx};
      `);

      const [{ praiseCount }] = praiseCountResult[0];
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
  }
},
  // 칭찬 랭킹
  praiseRanking: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const praiseCountResult = await sequelize.query(`
      SELECT COUNT(DISTINCT praisedName) as totalPraiserCount
      FROM praiseTarget`);

      const [{ totalPraiserCount }] = praiseCountResult[0];

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
  },
  // 칭찬 대상별 칭찬 내역 부르기
  eachTargetPraise: async (req, res) => {
    const userIdx = req.userIdx;
    // const praisedName = req.params;

    try {
      const rankingCountResult = await sequelize.query(`
      SELECT COUNT(praiseId) as praiseCount
      FROM praiseTarget
      where userId = ${userIdx};
      `);

      // const rankingCountResult = await praiseTarget.findAll({
      //   attributes: [[sequelize.fn('COUNT', sequelize.col('praiseTarget.praisedName')), 'praiseCount']]
      // });

      const [{ praiseCount }] = rankingCountResult[0];

      const targetPraise = await sequelize.query(`
      SELECT praisedName, created_at, today_praise
      FROM praiseTarget
      JOIN praise ON praiseTarget.praiseId = praise.id
      where userId = ${userIdx};
      `);
      // where praisedName LIKE '%${praisedName}%'

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