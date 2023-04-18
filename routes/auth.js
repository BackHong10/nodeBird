const express = require('express')
const passport = require('passport')
const {join,login,logout} = require('../controllers/auth')
const {inNotLoggedIn,isLoggedIn} = require('../middelwares/index')
const router = express.Router()

router.post('/join', inNotLoggedIn, join)

router.post('/login', inNotLoggedIn,login)

router.get('/logout', isLoggedIn, logout)


module.exports = router