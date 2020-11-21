module.exports = (sequelize, DataTypes) => {
    return sequelize.define('praise', {
        //모델의 Attributes (Column)을 정의하는곳
        daily_praise: {
            type: DataTypes.TEXT(),
            allowNull: false,
        },
        mission_praise: {
            type: DataTypes.TEXT(),
            allowNull: false,
        },
        is_do: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    }, {
        //모델의 옵션들을 지정하는 곳
        freezeTableName: true,
        timestamps: true,
    });
};