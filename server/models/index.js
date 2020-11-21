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
db.Praise = require('./praise')(sequelize, Sequelize);
db.PraiseTarget = require('./praiseTarget')(sequelize, Sequelize);

/** 1 : 1   User : Post */
db.Praise.hasOne(db.PraiseTarget, { onDelete: 'cascade' });
db.PraiseTarget.belongsTo(db.Praise);

module.exports = db;