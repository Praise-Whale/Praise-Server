# 💙 서비스 한줄 소개 💙

- ### 그거 알아? 칭찬은 하면 할수록 기분이 좋아진다는거? 우리 모두 칭찬 중독이 되어보는거 어때?
- ### [Notion 소개](https://www.notion.so/8cafb7768caa4b8c9cbf8e2e8d8b3361)

<br>

# 🐋 서비스 명 🐋

- ### `칭찬할고래`

![1](https://user-images.githubusercontent.com/45676906/99889339-71735600-2c97-11eb-8865-9c3a9d4783fd.png)

<br>

## `ERD(Entity Relation Diagram)`

<img width="586" alt="스크린샷 2020-11-22 오전 4 32 34" src="https://user-images.githubusercontent.com/45676906/99885915-c1442400-2c7b-11eb-90b8-641ee7a30bfa.png">


<br>

## `models/index.js`

```javascript
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
db.isDo = require('./isDo')(sequelize, Sequelize);
  

/** 1 : 1   Praise : P */
db.praise.hasOne(db.praiseTarget, { onDelete: 'cascade' });
db.praiseTarget.belongsTo(db.praise);

// M : N 관계
db.user.belongsToMany(db.praise, { through: 'isDo', as: 'praiser' })
db.praise.belongsToMany(db.user, { through: 'isDo', as: 'praised'})

module.exports = db;
```

<br>

## `pm2 log`

<img width="786" alt="스크린샷 2020-11-22 오전 7 47 23" src="https://user-images.githubusercontent.com/45676906/99889297-00cc3980-2c97-11eb-98c3-0cc35972292e.png">


<br>

## `API 명세서`

- ### [API 명세서](https://github.com/Praise-Whale/Praise_Server/wiki)

<br>


## `Android 프로젝트`

- ### [Android](https://github.com/Praise-Whale/Praise-Whale-AOS)

<br>

## `Contributor`

- ### [최정균](https://github.com/wjdrbs96)
- ### [최다인](https://github.com/DA-IN-droid)