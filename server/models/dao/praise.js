const pool = require('../../modules/pool');

const test = {
  userRanking: async (userIdx) => {
    const query = `SELECT COUNT(DISTINCT praisedName) as praiseCount FROM praiseTarget WHERE userId = ${userIdx}`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  latelyPraiseUsers: async (userIdx) => {
    const query = `SELECT distinct praisedName FROM praiseTarget WHERE userId = ${userIdx} LIMIT 3`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  userMonthPraiseCount: async (year, userIdx) => {
    const query = `SELECT COUNT(id) as praiseCount FROM praiseTarget where created_at LIKE '%${year}%' and userId = ${userIdx}`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }, 

  userYearPraiseCount: async (year, month, userIdx) => {
    const query = ` SELECT COUNT(id) as praiseCount FROM praiseTarget where created_at LIKE '%${year}%' and created_at LIKE '%-${month}%-' and userId = ${userIdx}`;
    try {
       const result = await pool.queryParam(query);
       return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  
  userWholePraise: async (year, userIdx) => {
    const query = `SELECT praisedName, created_at, today_praise FROM praiseTarget 
                  JOIN praise ON praiseTarget.praiseId = praise.id where created_at LIKE '%${year}%' and userId = ${userIdx}`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }, 

  userYearWhoalPraise: async (year, month, userIdx) => {
    const query = `SELECT praisedName, created_at, today_praise FROM praiseTarget
                  JOIN praise ON praiseTarget.praiseId = praise.id
                  Where created_at LIKE '%${year}%' and created_at LIKE '%-${month}%-'
                  and userId = ${userIdx}`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  
}

module.exports = test;