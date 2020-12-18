module.exports = (sequelize, DataTypes) => {
    return sequelize.define('praise', {
        //모델의 Attributes (Column)을 정의하는곳
        c: {
            type: DataTypes.TEXT(),
            allowNull: false,
        },
        praise_description: {
            type: DataTypes.TEXT(),
            allowNull: false,
        }
    }, {
        //모델의 옵션들을 지정하는 곳
        freezeTableName: true,
        timestamps: false,
    });
};

