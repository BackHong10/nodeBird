const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


exports.join = async (createInput) => {
    const {email,password,nick} = createInput

    const user = await User.findOne({
        where: {
            email,
        }
    })

    if(user){
        return 'exUser'
    }

    const hash = await bcrypt.hash(password, 10)

    await User.create({
        email,
        nick,
        password : hash
    })

    return 'success'
}

exports.getAccessToken = async (email,password,res) => {
    const user = await User.findOne({
        where: {
            email
        }
    })

    if(!user){
        return 'no user'
    }

    const comparePass = await bcrypt.compare(user.password, password)

    if(!comparePass){
        return 'different password'
    }

    const accessToken = jwt.sign({
        email: user.email, sub: user.id},
      {secret: process.env.accessTokenSecret, expiresIn: '1h'}
      )
    
    const refreshToken = jwt.sign({
    email: user.email, sub: user.id},
    {secret: process.env.refreshTokenSecret, expiresIn: '2w'}
    )
    res.setHeader('Set-Cookie', `refreshToken= ${refreshToken}`)
    return accessToken


}