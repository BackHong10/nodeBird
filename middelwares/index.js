const jwt = require('jsonwebtoken')
const User = require('../models/user')



exports.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.status(403).send('로그인 필요')
    }
}

exports.isNotLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        next()
    }
    else{
        const message = encodeURIComponent('로그인한 상태입니다.')
        res.redirect(`/?error =${message}`)
    }
}

exports.isLoggedInByToken = async (req,res,next) => {
    const accessToken = req.headers.authorization.split(" ")[1]
    const refreshToken = req.headers.refreshToken.split(" ")[1]

    let validAccessToken
    let validRefreshToken

    jwt.verify(accessToken, process.env.accessTokenSecret, 
        async (error, decoded) => {
            if(error){
                return res.send(error)
            }
            validAccessToken = decoded
        }
        )

    jwt.verify(refreshToken, process.env.refreshTokenSecret, 
        async (error, decoded) => {
            if(error){
                return res.send(error)
            }
            validRefreshToken = decoded
        }
        )
    
    if(!validAccessToken && !validRefreshToken){
        return res.send("토큰이 만료되었거나 유효하지 않은 토큰입니다.")
    }

    if(!validAccessToken && validRefreshToken){
        const newAccessToken = jwt.sign(
            {email : validRefreshToken.email, sub: validRefreshToken.id},
            {secret: process.env.accessTokenSecret, expiresIn: "1h"}
        )

        return res.json({
            msg: "액세스 토큰이 만료되어 재발급합니다.",
            accesstoken: newAccessToken
        })
    }

    if(validAccessToken && validRefreshToken){
        User.findOne({
            where: {
                email: validAccessToken.email
            }
        }).then((user) =>{
            res.locals.user = user
            next()
        }).catch((error) => {
            next(error)
        })

        
    }




}