const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.praise = require('./praise')(sequelize, Sequelize);
db.praiseTarget = require('./praiseTarget')(sequelize, Sequelize);
db.user = require('./user')(sequelize, Sequelize);
db.userLevel = require('./userLevel')(sequelize, Sequelize);
db.praiseSentence = require('./praiseSentence')(sequelize, Sequelize);

// 유저 - 레벨 ( 1:1 관계 )
db.user.hasOne(db.userLevel, { onDelete: 'cascade'});
db.userLevel.belongsTo(db.user);  

/** 1 : 1   Praise : P */
db.praise.hasOne(db.praiseTarget, { onDelete: 'cascade' });
db.praiseTarget.belongsTo(db.praise);

module.exports = db;