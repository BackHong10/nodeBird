const express = require('express')
const passport = require('passport')
const {join,login,logout} = require('../controllers/auth')
const {isNotLoggedIn,isLoggedIn} = require('../middelwares/index')
const router = express.Router()

router.post('/join', isNotLoggedIn, join)

router.post('/login', isNotLoggedIn,login)

router.get('/logout', isLoggedIn, logout)


module.exports = router