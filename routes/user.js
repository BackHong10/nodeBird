const express = require('express');

const { isLoggedIn } = require('../middelwares');
const { follow,unFollow,updateProfile,likePost,unLikePost } = require('../controllers/user');

const router = express.Router();

// POST /user/:id/follow
router.post('/:id/follow', isLoggedIn, follow);
router.post('/:id/unfollow',isLoggedIn,unFollow)
router.post('/update', isLoggedIn,updateProfile)
router.post('/:id/like', isLoggedIn, likePost)
router.post('/:id/unlike', isLoggedIn, unLikePost)


module.exports = router;