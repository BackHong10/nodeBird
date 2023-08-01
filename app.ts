import express, { ErrorRequestHandler, RequestHandler } from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'path'
import session from 'express-session'
import nunjucks from 'nunjucks'
import dotenv from 'dotenv'
import { sequelize } from './models'
import passport from 'passport'
import helmet from "helmet"
import hpp from "hpp"


dotenv.config()

import pageRouter from './routes/page'
import authRouter from './routes/auth'
import postRouter from './routes/post'
import userRouter from './routes/user'
import passportConfig from './passport'

const app = express()
passportConfig()
app.set('port', process.env.PORT || 3000)
app.set('view engine','html')
nunjucks.configure('views', {
    express : app,
    watch: true
})

sequelize.sync().then(() => {
    console.log("데이터 베이스 연결에 성공하였습니다.")
})

if(process.env.NODE_ENV === 'production'){
    app.enable("trust proxy")
    app.use(morgan('combined'))
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
    }))
    app.use(hpp())
}
else{
    app.use(morgan('dev'))
}
app.use(express.static(path.join(__dirname,'public')))
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser(process.env.COOKIE_SECRET))
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    proxy:false,
    
    // store: new RedisStore({ client: redisClient }),
};

if(process.env.NODE_ENV === 'production'){
    sessionOption.proxy = true
    sessionOption.cookie.secure = true
}
app.use(session(sessionOption))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', pageRouter)
app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/user',userRouter)

app.use((req,res,next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
    error.status = 404
    next(error)
})

const errorHandler: ErrorRequestHandler = (err,req,res,next) => {
    res.locals.message = err.message
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}
    res.status(err.status || 500)
    res.render('error')
}

app.use(errorHandler)

app.listen(app.get('port'), () => {
    console.log("서버가 실행되었습니다.")
})
