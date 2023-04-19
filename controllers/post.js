const User = require('../models/user');
const Post = require('../models/post')
const Hashtag = require('../models/hashtag')

exports.afterUploadImage = (req,res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
}

exports.uploadPost = async (req,res,next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id
        })

        const hashtag = req.body.content.match(/#[^\s#]*/g);

        if(hashtag){
            const result = await Promise.all(
                hashtag.map(tag => {
                  return Hashtag.findOrCreate({
                    where: { title: tag.slice(1).toLowerCase() },
                  })
                }),
              );
              await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/')
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.updatePost = async (req,res,next) => {
    try {
        
        const post = await Post.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: User,
                    where: {
                        id : req.user.id
                    },
                    attributes: ['id']

                }
            ]
        })
        
        if(!post){
            return res.status(404).send("수정권한이 없습니다.")
        }

        await Post.update({content : req.body.content}, {where : {
            id: req.params.id
        }})

        res.send("수정 성공")
        
    } catch (error) {
        console.error(error)
        next(error)
        
    }

}

exports.deletePost = async (req,res,next) => {
    try {
        console.log(req.user.id)
        const post = await Post.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: User,
                    where: {
                        id : req.user.id
                    },
                    attributes: ['id']

                }
            ]
        })

        if(!post){
            return res.status(404).send("삭제 권한이 없습니다.")
        }

        await Post.destroy({
            where: {
                id: req.params.id
            }
        })

        res.send("삭제 성공")
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.readPostByNick = async (req,res,next) => {
    const post = await Post.findAll({
        include:[
            {
                model : User,
                where: {
                    nick: req.params.nick
                }
            }
        ]
    })

    res.send(post)
}