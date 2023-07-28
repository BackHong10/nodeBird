const {join,getAccessToken} = require('../services/auth')
const passport = require('passport')



exports.join = async (req,res,next) => {
    const {email, password, nick} = req.body

    try {
        const result = await join(req.body)

        if(result === 'exUser') {
            return res.redirect('/join?error=exist');
        }
        else if(result === 'success'){
          return res.redirect('/')
        }

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
  const result = await getAccessToken(req.body.email, req.body.password, res)

  if(result === 'no user'){
    res.send('no user')
  }
  else if(result === 'different password'){
    res.send('different password')
  }

  return res.json({
    msg: "로그인 성공",
    accessToken: result
  })
}