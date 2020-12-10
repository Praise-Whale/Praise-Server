
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('isPraised', {
    is_praised: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    timestamps: false,
    freezeTableName: true,
  })
}