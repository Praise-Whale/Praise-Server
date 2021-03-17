const admin = require("firebase-admin");
const firebaseConfig = require("../config/firebase.json");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const util = require("../modules/util");
const praise = require("../models/dao/praise");
const users = require('../models/dao/user');
const { praiseTarget, sequelize } = require("../models/index");
const praiseService = require("../service/praiseService");
const schedule = require("node-schedule");

const rule = new schedule.RecurrenceRule();

rule.tz = "Asia/Seoul";

rule.hour = 23;
rule.minute = 55;
rule.second = 0;

const sch = schedule.scheduleJob(rule, async () => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });

    var payload = {
      data: {
        title: "오늘의 칭찬이 도착했어요!",
        body: "지금 바로 오늘의 칭찬을 확인하고, 실천해보세요!",
      },
    };

    const userAllDeviceTokens = await users.userAllDeviceToken();

    // 현재 deviceToken 이 null이 존재해서 방어 로직
    const result = [];
    for (let i = 0; i < userAllDeviceTokens.length; ++i) {
      if (userAllDeviceTokens[i].deviceToken != '') {
        result.push(userAllDeviceTokens[i].deviceToken);
      }
    }
    console.log(result);
    
    admin
      .messaging()
      .sendToDevice(result, payload)
      .then(function (response) {
        console.log("성공 메세지!" + response);
      })
      .catch(function (error) {
        console.log("보내기 실패 : ", error);
      });
  } catch (err) {
    console.log(err);
  }
});

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

    // 리팩터링 해보기 -> module 로 빼놓을까 흠
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
      const praiseCountResult = await praise.totalRankingCount(userIdx);

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
  // 칭찬 대상별 카드 조회
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
      const rankingCountResult = await praise.userRankingCount(praisedName, userIdx);

      const { praiseCount } = rankingCountResult[0];

      const targetPraise = await praise.userTargetPraise(praisedName, userIdx);

      const collectionPraise = targetPraise;

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
