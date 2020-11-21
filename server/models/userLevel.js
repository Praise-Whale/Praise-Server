module.exports = (sequelize, DataTypes) => {
  return sequelize.define('userLevel', {
    userLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      reference: {
        model: 'user',
        key: 'id',
      }
    }
  }, {
    timestamps: false
  })
}