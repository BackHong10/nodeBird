const User = require('../models/user');
const Post = require('../models/post')
const Hashtag = require('../models/hashtag')

exports.uploadPost = async (postInput, userId) => {
    const {content, url} = postInput

    const post = await Post.create({
        content,
        img: url,
        UserId:userId
    })

    const hashtag = content.match(/#[^\s#]*/g);

    
    
    if(hashtag){
        const result = await Promise.all(
            hashtag.map(tag => {
                return Hashtag.findOrCreate({
                    where: {
                        title: tag.slice(1).toLowerCase()
                    }
                })
            })
        )
        await post.addHashtags(result.map(r => r[0]))
    }
    return 'success'
}

exports.updatePost = async (content, postId, userId) => {
    const post = await Post.findOne({
        where: {
            id: postId
        },
        include: [
            {
                model: User,
                where: {
                    id: userId
                },
                attributes:['id']
            }
        ]
    })

    if(!post){
        return '수정권한이 없음'
    }

    await Post.update({content: content}, {where: {
        id: postId
    }})
    return 'success'
}

exports.deletePost = async (postId,userId) => {
    const post = await Post.findOne({
        where: {
            id : postId
        },
        include: [
            {
                model: User,
                where: {
                    id: userId
                },
                attributes: ['id']
            }
        ]
    })

    if(!post){
        return '권한 없음'
    }

    await Post.destroy({
        where: {
            id: postId
        }
    })

    return 'success'
}

exports.readPostByNick = async (nick) => {
    const post = await Post.findAll({
        include: [
            {
                model: User,
                where: {
                    nick: nick
                }
            }

        ]
    })
    return post
}