const Sequelize = require('sequelize')

class User extends Sequelize.Model{
    static initiate(sequelize){
        User.init({
           email : {
            type : Sequelize.STRING(40),
            allowNull: true,
            unique: true
           }, 
           nick: {
            type : Sequelize.STRING(15),
            allowNull: true
           },
           password: {
            type : Sequelize.STRING(100),
            allowNull: true
           },
           provider: {
            type : Sequelize.ENUM('local', 'kakao'),
            allowNull: true,
            defaultValue: 'local'
           },
           snsId: {
            type : Sequelize.STRING(30),
            allowNull: true
           },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
    }

    static associate(db){
        db.User.hasMany(db.Post)
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',
          });
          db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
          });
    }
}

module.exports = User
