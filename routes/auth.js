const express = require('express')
const passport = require('passport')
const {join,login,logout, loginToken} = require('../controllers/auth')
const {isNotLoggedIn,isLoggedIn} = require('../middelwares/index')
const router = express.Router()

router.post('/join', isNotLoggedIn, join)

router.post('/login', isNotLoggedIn,login)

router.get('/logout', isLoggedIn, logout)

router.get('/login/token',loginToken)


module.exports = router