
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users', {
    nickName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    userLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    alarmCheck: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
  })
}