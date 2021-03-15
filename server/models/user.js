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
    whaleName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    refreshToken: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    deviceToken: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    alarmCheck: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    alarmTime: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "9:00"
    }
  }, {
    freezeTableName: true,
    timestamps: false,
  })
}