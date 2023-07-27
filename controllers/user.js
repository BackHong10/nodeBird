const User = require('../models/user')
const {Follow} = require('../services/user')
const bcrypt = require('bcrypt')
const Post = require('../models/post');


exports.follow = async (req,res,next) => {
    try {
        const result = await Follow(req.user.id, req.params.id)

        if(result === 'no user'){
          res.send('no user')
        }
        else{
          res.send('success')
        }
        
      } catch (error) {
        console.error(error);
        next(error);
      }
}

exports.unFollow = async (req,res,next) => {
  try {
    console.log(req.user.id, req.params.id)
    const user = await User.findOne({
      where: {
        id: req.user.id
      },
      include: [
        {
          model: User,
          as: "Followings"
        }
      ]
    })
    await user.removeFollowings(req.params.id).then(r => res.send("삭제성공"))
    .catch(error => res.send("삭제 실패"))

  } catch (error) {
    console.error(error)
    next(error)
  }
}

exports.updateProfile = async (req,res,next) => {
  try {
    const {nick, password} = req.body
    if(!nick && !password){
      return res.send("수정할 정보가 없습니다.")
    }
    const user = await User.findOne({
      where: {
        id: req.user.id
      }
    })
    let hash = user.password

    if(password){
      hash = await bcrypt.hash(password,10)
    }

    await User.update({
      nick: nick ? nick : user.nick,
      password: hash
    }, {
      where: {
        id: req.user.id
      }
    })

    res.send("프로필 수정 성공")
    

  } catch (error) {
    console.error(error)
    next(error)
  }
}

exports.likePost = async (req,res,next) => {
      const user = await User.findOne({
        where: {
          id: req.user.id
        }
      })

      await user.addPostLike(req.params.id)

      const post = await Post.findOne({
        where: {
          id: req.params.id
        },
      })
      const count = await post.getUserLike()
      console.log(count.length)



      res.json({count : count.length})

}
exports.unLikePost = async (req,res,next) => {
  const user = await User.findOne({
    where: {
      id: req.user.id
    }
  })

  await user.removePostLike(req.params.id)

  const post = await Post.findOne({
    where: {
      id: req.params.id
    },
  })
  const count = await post.getUserLike()
  console.log(count.length)



  res.json({count : count.length})


}