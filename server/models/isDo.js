const { user, praise } = require('../models');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('isDo', {
    is_do: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    timestamps: false,
    freezeTableName: true,
  })
}