const User = require('../models/user')
const {Follow,unFollow,updateProfile,likePost,unLikePost} = require('../services/user')

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
    const result = await unFollow(req.user.id, req.params.id)

    if(result === 'no user'){
      res.send('no user')
    }
    else if(result === 'success'){
      res.send('success')
    }
    else{
      res.send('삭제하지 못했습니다.')
    }

  } catch (error) {
    console.error(error)
    next(error)
  }
}

exports.updateProfile = async (req,res,next) => {
  try {
    const result = await updateProfile(req.body,req.user.id)

    if(result === 'success'){
      res.send('success')
    }
    else if(result === '정보 없음'){
      res.send('정보없음')
    }
    

  } catch (error) {
    console.error(error)
    next(error)
  }
}

exports.likePost = async (req,res,next) => {
      const result = await likePost(req.user.id, req.params.id)


      res.json({count : result})

}
exports.unLikePost = async (req,res,next) => {
  
  const result = await unLikePost(req.user.id, req.params.id)


  res.json({count : result})


}