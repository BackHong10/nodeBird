import Sequelize, { BelongsToManyGetAssociationsMixin, CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import Post from './post'

class HashTag extends Model<InferAttributes<HashTag>, InferCreationAttributes<HashTag>>{
    declare id : CreationOptional<number>
    declare title: string
    declare createdAt : CreationOptional<Date>
    declare updatedAt : CreationOptional<Date>

    declare getPosts: BelongsToManyGetAssociationsMixin<Post>

    static initiate(sequelize: Sequelize.Sequelize){
        HashTag.init({
            id : {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type : Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: "HashTag",
            tableName: 'HashTags',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    };

    static associate(){
        HashTag.belongsToMany(Post,{through: "PostHashTag"})
    }
}

export default HashTag