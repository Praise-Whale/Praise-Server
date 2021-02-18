module.exports = (sequelize, DataTypes) => {
  return sequelize.define('isPraised', {
    is_praised: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
  }
  }, {
    timestamps: false,
    freezeTableName: true,
  })
}