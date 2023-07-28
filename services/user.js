const User = require('../models/user')
const Post = require('../models/post')
const bcrypt = require('bcrypt')

exports.Follow = async (userId, followId) => {
    console.log(followId)
    const user = await User.findOne({
        where: {
            id: userId
        }
    })
    console.log(user)

    if(user){
        await user.addFollowings(parseInt(followId,10))
        return 'success'
    }
    else{
        return 'no user'
    }
}

exports.unFollow = async (userId, followId) => {
    const user = await User.findOne({
        where: {
            id : userId
        }
    })

    if(!user){
        return 'no user'
    }
    let result = null
    await user.removeFollowings(followId).then(() => {
        result = 'success'
    }).catch((error) => {
        result = 'error'
    })
    return result
    
}

exports.updateProfile = async (updateInput,userId) => {
    const {nick, password} = updateInput

    if(!nick && !password){
        return '정보 없음'
    }

    const user = await User.findOne({
        where: {
            id: userId
        }
    })

    let hash = user.password

    if(password){
        hash = await bcrypt.hash(password,10)
    }

    await User.update({
        nick : nick ? nick : user.nick,
        password : hash
    },
    {where: {
        id: userId
    }})

    return 'success'
}

exports.likePost = async (userId, postId) => {
    const user = await User.findOne({
        where: {
            id: userId
        }
    })

    await user.addPostLike(postId)

    const post = await Post.findOne({
        where: {
            id: postId
        }
    })

    const count = await post.getUserLike()

    return count.length
}

exports.unLikePost = async (userId,postId) => {
    const user = await User.findOne({
        where: {
            id: userId
        }
    })

    await user.removePostLike(postId)

    const post = await Post.findOne({
        where: {
            id: postId
        }
    })

    const count = await post.getUserLike()

    return count.length
}