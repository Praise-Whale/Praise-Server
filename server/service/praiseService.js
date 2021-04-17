const { user, praiseTarget, sequelize } = require('../models/index');

module.exports = {
  userLevelUp: async (userIdx, updateUserLevel) => {
    try {
      const levelUpUsers = await user.update({
        userLevel: updateUserLevel,
      }, {
        where: {
          id: userIdx
        }
      });
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  praiseAdd: async (praisedName, praiseId, userIdx, created_at) => {
    try {
      const praiseInsert = await praiseTarget.create({
        praisedName: praisedName,
        praiseId: praiseId,
        userId: userIdx,
        created_at: created_at,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  praiseRankingResult: async (userIdx) => {
    try {
      const rankingResult = await praiseTarget.findAll({
        attributes: [
          "praisedName",
          [
            sequelize.fn("COUNT", sequelize.col("praiseTarget.praisedName")),
            "praiserCount",
          ],
        ],
        where: {
          userId: userIdx,
        },
        group: ["praiseTarget.praisedName"],
        raw: true,
        order: sequelize.literal("praiserCount DESC"),
        limit: 5,
      });
      return rankingResult;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}