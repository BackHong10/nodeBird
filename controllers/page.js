const Post = require('../models/post')
const User = require('../models/user')


exports.renderProfile = (req,res,next) => {
    res.render('profile', {title : '내 정보 - NodeBird'})


}
exports.renderJoin = (req,res,next) => {

    res.render('join',{title : '회원가입 - NodeBird'})

}
exports.renderMain = async (req,res,next) => {
    try {
        const post = await Post.findAll({
            include: {
                model: User,
                attributes: ['id','nick']
            },
            order: [['createdAt', 'DESC']]
        })
        res.render('main',{title : 'NodeBird', twits : post})
    } catch (error) {
        console.error(err);
        next(err);
    }
    

}