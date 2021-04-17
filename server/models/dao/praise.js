const pool = require('../../modules/pool');

const praisePool = {
  totalRankingCount: async (userIdx) => {
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
    const query = `SELECT distinct praisedName FROM praiseTarget WHERE userId = ${userIdx} ORDER BY id DESC LIMIT 3`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  userWholePraiseCount: async (year, userIdx) => {
    const query = `SELECT COUNT(id) as praiseCount FROM praiseTarget where created_at LIKE '%${year}%' and userId = ${userIdx}`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  userYearMonthPraiseCount: async (year, month, userIdx) => {
    const query = ` SELECT COUNT(id) as praiseCount FROM praiseTarget where created_at LIKE '%${year}%' and created_at LIKE '%-${month}-%' and userId = ${userIdx}`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  userFirstPraise: async (userIdx) => {
    const query = `SELECT created_at FROM praiseTarget where userId = ${userIdx}`;
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
                  JOIN praise ON praiseTarget.praiseId = praise.id where created_at LIKE '%${year}%' and userId = ${userIdx} ORDER BY created_at DESC`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  userYearMonthPraise: async (year, month, userIdx) => {
    const query = `SELECT praisedName, created_at, today_praise FROM praiseTarget
                  JOIN praise ON praiseTarget.praiseId = praise.id
                  Where created_at LIKE '%${year}%' and created_at LIKE '%-${month}-%'
                  and userId = ${userIdx} ORDER BY created_at DESC`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  userRankingCount: async (praisedName, userIdx) => {
    const query = `SELECT COUNT(praisedName) as praiseCount FROM praiseTarget
                  where praisedName = '${praisedName}' and userId = ${userIdx}`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  userTargetPraise: async (praisedName, userIdx) => {
    const query = `SELECT praisedName, created_at, today_praise FROM praiseTarget
                  JOIN praise ON praiseTarget.praiseId = praise.id
                  where praisedName = '${praisedName}' and userId = ${userIdx}
                  ORDER BY created_at DESC`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = praisePool;