const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const {afterUploadImage,uploadPost, updatePost,deletePost,readPostByNick} = require('../controllers/post')
const {isLoggedIn} = require('../middelwares')

const router = express.Router()

try {
    fs.readdirSync('uploads')
} catch (error) {
    fs.mkdirSync('uploads');
}


const upload = multer({
    storage: multer.diskStorage({
        destination(req,file,cb){
            cb(null, 'uploads/')
        },
        filename(req,file,cb){
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
        
    }),
    // limits: { fileSize: 5 * 1024 * 1024 },

})

router.post('/img', isLoggedIn, upload.single('img'),afterUploadImage)

const upload2 = multer()
router.post('/', isLoggedIn, upload2.none(), uploadPost)

router.post('/:id/update', isLoggedIn,updatePost )

router.delete('/:id/delete', isLoggedIn,deletePost )

router.get('/:nick',readPostByNick)

module.exports = router