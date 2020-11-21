const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';         // 개발용 환경 설정
const config = require('../config/config.json')[env];      // Sequelize 설정 파일
const db = {};

// Sequelize 인스턴스화
let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.usename, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
