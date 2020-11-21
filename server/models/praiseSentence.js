module.exports = (sequelize, DataTypes) => {
  return sequelize.define('praiseSentence', {
    senetence: {
      type: DataTypes.TEXT(),
      allowNull: false,  
    },
    on_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    timestamps: false
  })
}