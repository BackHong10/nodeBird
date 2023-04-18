const express = require('express')
const {renderJoin,renderMain,renderProfile} = require('../controllers/page')
const router = express.Router()
const {isLoggedIn,inNotLoggedIn} = require('../middelwares/index')

router.use((req,res,next) => {
    res.locals.user = req.user;
  res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
  next();
})

router.get('/profile', isLoggedIn, renderProfile)
router.get('/join', inNotLoggedIn,renderJoin)
router.get('/', renderMain)

module.exports = router