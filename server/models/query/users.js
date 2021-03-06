const pool = require('../../modules/pool');

const test = {
  userRanking: async (userIdx) => {
    const query = `SELECT COUNT(praisedName) as praiseCount FROM praiseTarget WHERE userId = ${userIdx}`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = test;