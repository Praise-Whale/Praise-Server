const poolPromise = require("../config/database");

module.exports = {
  queryParam: async (query) => {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await poolPromise;
        const connection = await pool.getConnection();
        try {
          const result = await connection.query(query);
          pool.release;
          resolve(result);
        } catch (err) {
          poolPromise.release(connection);
          reject(err);
        }
      } catch (err) {
        reject(err);
      }
    });
  },
  queryParamArr: async (query, value) => {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await poolPromise;
        const connection = await pool.getConnection();
        try {
          const result = await connection.query(query, value);
          pool.release;
          resolve(result);
        } catch (err) {
          pool.release;
          reject(err);
        }
      } catch (err) {
        reject(err);
      }
    });
  },
  Transaction: async (...args) => {
    return new Promise(async (resolve, reject) => {
      try {
        const pool = await poolPromise;
        const connection = await pool.getConnection();
        try {
          await connection.beginTransaction();
          args.forEach(async (it) => await it(connection));
          await connection.commit();
          pool.release;
          resolve(result);
        } catch (err) {
          await connection.rollback();
          pool.release;
          reject(err);
        }
      } catch (err) {
        reject(err);
      }
    });
  },
};
