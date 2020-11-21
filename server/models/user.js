
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users', {
    loginId: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    userLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
    
  }, {
    freezeTableName: true,
    timestamps: false,
  })
}