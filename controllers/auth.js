const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


exports.join = async (req,res,next) => {
    const {email, password, nick} = req.body

    try {
        const exUser = await User.findOne({where:{email}})

        if(exUser) {
            return res.redirect('/join?error=exist');
        }

        const hash = await bcrypt.hash(password,12)

        await User.create({
            email,
            nick,
            password : hash
        })

        return res.redirect('/')
    } catch (error) {

        console.error(error);
    return next(error);
    }
} 

exports.login = (req,res,next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
          console.error(authError);
          return next(authError);
        }
        if (!user) {
          return res.send("유저가 없습니다.");
        }
        return req.login(user, (loginError) => {
          if (loginError) {
            console.error(loginError);
            return next(loginError);
          }
          return res.redirect('/');
        });
      })(req, res, next);
} 

exports.logout = (req,res,next) => {
    req.logout(() => {
        res.redirect('/');
      });
} 


exports.loginToken = async (req,res,next) => {
  const {email, password} = req.body

  const exUser = await User.findOne({
    where : {
      email: email
    }
  })

  if(!exUser){
    return res.send("존재하지 않는 이메일입니다.")
  }

  const accessToken = jwt.sign({
    email: exUser.email, sub: exUser.id},
  {secret: process.env.accessTokenSecret, expiresIn: '1h'}
  )

  const refreshToken = jwt.sign({
    email: exUser.email, sub: exUser.id},
  {secret: process.env.refreshTokenSecret, expiresIn: '2w'}
  )

  res.setHeader('Set-Cookie', `refreshToken= ${refreshToken}`)
  return res.json({
    msg: "로그인 성공",
    accesstoken: accessToken
  })
}