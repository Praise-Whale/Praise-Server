# 💙 서비스 한줄 소개 💙

- ### 그거 알아? 칭찬은 하면 할수록 기분이 좋아진다는거? 우리 모두 칭찬 중독이 되어보는거 어때?
- ### [Notion 소개](https://www.notion.so/8cafb7768caa4b8c9cbf8e2e8d8b3361)

<br>

# ✔ 고래단 서버 컨벤션 ✔

- [브랜치 전략](https://github.com/Praise-Whale/Praise_Server/blob/develop/server/info/%EB%B8%8C%EB%9E%9C%EC%B9%98%EC%A0%84%EB%9E%B5%EA%B3%BC%20%ED%92%80%EB%A6%AC%ED%80%98%EC%8A%A4%ED%8A%B8.md)
- [코드 컨벤션](https://github.com/Praise-Whale/Praise_Server/blob/develop/server/info/%EC%BD%94%EB%93%9C%20%EC%BB%A8%EB%B2%A4%EC%85%98.md)
- [커밋 컨벤션](https://github.com/Praise-Whale/Praise_Server/blob/develop/server/info/%EC%BB%A4%EB%B0%8B%EC%BB%A8%EB%B2%A4%EC%85%98.md)

<br>

# 🐋 서비스 명 🐋

- ### `칭찬할고래`

![1](https://user-images.githubusercontent.com/45676906/101926565-b0515780-3c16-11eb-848a-c55b729cabad.png)

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

/** 1 : 1   Praise : PraiseTarget */
db.praise.hasOne(db.praiseTarget, { onDelete: 'cascade' });
db.praiseTarget.belongsTo(db.praise);

/** 1 : N   User : PraiseTarget */
db.user.hasMany(db.praiseTarget, { ondDelete: 'cascade' });
db.praiseTarget.belongsTo(db.user, { onDelete: 'cascade' });

module.exports = db;
```

<br>

## `ERD(Entity Relation Diagram)`

![ERD](https://user-images.githubusercontent.com/45676906/111873904-0718bb00-89d6-11eb-81be-8af3b5924eed.png)



<br>

## `Contributor`

- ### [최정균](https://github.com/wjdrbs96)
- ### [최다인](https://github.com/Chedda98)
