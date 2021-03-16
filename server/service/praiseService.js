const { user, praiseTarget } = require('../models/index');

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
  }
}