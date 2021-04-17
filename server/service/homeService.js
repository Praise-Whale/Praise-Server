const { praise } = require('../models/index');

module.exports = {
  homePraise: async (praiseId) => {
    try {
      const praiseHome = await praise.findOne({
        attributes: ['id', 'today_praise', 'praise_description'],
        where: {
          id: praiseId
        },
      });
      return praiseHome;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}