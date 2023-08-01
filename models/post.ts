import Sequelize, { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import HashTag from './hashtag'
import User from './user'

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>>{
    declare id: CreationOptional<number>
    declare content : string
    declare img : string
    declare createdAt : CreationOptional<Date>
    declare updatedAt : CreationOptional<Date>

    static initiate(sequelize : Sequelize.Sequelize){
        Post.init({
            id: {
                type : Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            content: {
                type : Sequelize.STRING,
                allowNull: false,

            },
            img: {
                type : Sequelize.STRING,
                allowNull: true
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }

    static associate(){
        Post.belongsTo(User);
        Post.belongsToMany(HashTag, {through : 'PostHashTag'})
    }
}

export default Post