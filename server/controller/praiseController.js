const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const util = require("../modules/util");
const praise = require("../models/dao/praise");
const { praiseTarget, sequelize } = require("../models/index");
const praiseService = require("../service/praiseService");

module.exports = {
  // 칭찬한 사람 등록
  praiserUp: async (req, res) => {
    const userIdx = req.userIdx;
    const { praisedName, created_at } = req.body;
    const { praiseId } = req.params;

    if (!praisedName || !praiseId) {
      res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    await praiseService.praiseAdd(praisedName, praiseId, userIdx, created_at);

    const toastMsgResult = await praiseTarget.findAll({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("praiseTarget.id")), "toastCount"],
      ],
      where: {
        userId: userIdx,
      },
    });

    const { toastCount } = toastMsgResult[0].dataValues;


    let levelCheck = false;

    // 리팩터링 해보기
    switch (toastCount) {
      case 5:
        levelCheck = await praiseService.userLevelUp(userIdx, 1);
        break;
      case 10:
        levelCheck = await praiseService.userLevelUp(userIdx, 2);
        break;
      case 30:
        levelCheck = await praiseService.userLevelUp(userIdx, 3);
        break;
      case 50:
        levelCheck = await praiseService.userLevelUp(userIdx, 4);
        break;
      case 100:
        levelCheck = await praiseService.userLevelUp(userIdx, 5);
        break;
    }

    res.status(statusCode.OK).send(
      util.success(statusCode.OK, responseMessage.PRAISERUP_SUCCESS, {
        toastCount,
        levelCheck,
      })
    );
  },
  // 최근 칭찬 3명 유저 조회
  latelyParaiseUsers: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const praiseUsers = await praise.latelyPraiseUsers(userIdx);

      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.LATELY_PRAISE_USER,
            praiseUsers
          )
        );
      return;
    } catch (err) {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR
          )
        );
      return;
    }
  },
  // 칭찬 카드 조회(전체 + 연도, 월별)
  praiseCollection: async (req, res) => {
    const userIdx = req.userIdx;
    const { year, month } = req.params;

    try {
      if (month == 0) {
        const wholePraiseCount = await praise.userWholePraiseCount(year, userIdx);
        const praiseCount = wholePraiseCount[0].praiseCount;

        const firstPraise = await praise.userFirstPraise(userIdx);

        if (firstPraise.length == 0) {
          return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }

        const firstDate = firstPraise[0];

        const collectionPraise = await praise.userWholePraise(year, userIdx);

        return res.status(statusCode.OK).send(
          util.success(statusCode.OK, responseMessage.PRAISE_ALL_COLLECTION, {
            praiseCount,
            firstDate,
            collectionPraise,
          })
        );
      }

      const yearMonthPraiseCount = await praise.userYearMonthPraiseCount(year, month, userIdx);
      const praiseCount = yearMonthPraiseCount[0].praiseCount;

      const firstPraise = await praise.userFirstPraise(userIdx);
      
      if (firstPraise.length == 0) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      }

      const firstDate = firstPraise[0];
      
      const collectionPraise = await praise.userYearMonthPraise(year, month, userIdx);

      return res.status(statusCode.OK).send(
        util.success(
          statusCode.OK,
          responseMessage.PRAISE_YEAR_MONTH_COLLECTION,
          {
            praiseCount,
            firstDate,
            collectionPraise,
          }
        )
      );
    } catch (err) {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR
          )
        );
      return;
    }
  },

  // 칭찬 랭킹
  praiseRanking: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const praiseCountResult = await praise.userRanking(userIdx);

      const totalPraiserCount = praiseCountResult[0].praiseCount;

      const rankingCountResult = await praiseService.praiseRankingResult(userIdx);

      res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.PRAISE_RANKING_SUCCESS, {
          totalPraiserCount,
          rankingCountResult,
        })
      );
      return;
    } catch (err) {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR
          )
        );
      return;
    }
  },
  // 칭찬 카드 조회
  myPraiseCard: async (req, res) => {
    const userIdx = req.userIdx;
    const { praisedName } = req.query;

    if (!praisedName) {
      res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
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
      where praisedName = '${praisedName}' and userId = ${userIdx}
      ORDER BY created_at DESC;
      `);

      const collectionPraise = targetPraise[0];

      res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.EACH_PRAISE_SUCCESS, {
          praiseCount,
          collectionPraise,
        })
      );
    } catch (err) {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR
          )
        );
      return;
    }
  },
};
