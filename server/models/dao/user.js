const pool = require('../../modules/pool');

module.exports = {
  userAllDeviceToken: async () => {
    const query = `SELECT deviceToken FROM users where alarmCheck = 1`;
    try {
      const result = pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}