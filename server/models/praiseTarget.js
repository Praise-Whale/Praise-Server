module.exports = (sequelize, DataTypes) => {
    return sequelize.define('praiseTarget', {
        //모델의 Attributes (Column)을 정의하는곳
        praisedName: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        praiseId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'praise',
                key: 'id',
            },
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'users',
                key: 'id',
            },
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        //모델의 옵션들을 지정하는 곳
        freezeTableName: true,
        timestamps: false,
    });
};