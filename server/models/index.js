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

/** 1 : 1   Praise : PraiseTarget */
db.praise.hasOne(db.praiseTarget, { onDelete: 'cascade' });
db.praiseTarget.belongsTo(db.praise);

/** N : M   User : Praise */
db.user.belongsToMany(db.praise, { through: 'isPraised', as: 'praised' });
db.praise.belongsToMany(db.user, { through: 'isPraised', as: 'praiser'});

/** 1 : N   User : PraiseTarget */
db.user.hasMany(db.praiseTarget, { ondDelete: 'cascade' });
db.praiseTarget.belongsTo(db.user, { onDelete: 'cascade' });

module.exports = db;