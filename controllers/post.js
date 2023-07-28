const {uploadPost,deletePost,updatePost,readPostByNick} = require('../services/post')

exports.afterUploadImage = (req,res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
}

exports.uploadPost = async (req,res,next) => {
    try {
        const result = await uploadPost(req.body,req.user.id)

        if(result === 'success'){
            res.redirect('/')
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.updatePost = async (req,res,next) => {
    try {
        
        const result = await updatePost(req.body.content, req.params.id, req.user.id)

        if(result === 'success'){
            res.send('success')
        }
        else if(result === '수정권한이 없음'){
            res.status(404).send('수정권한이 없음')
        }
        
    } catch (error) {
        console.error(error)
        next(error)
        
    }

}

exports.deletePost = async (req,res,next) => {
    try {
        const result = await deletePost(req.params.id, req.user.id)

        if(result === 'success'){
            res.send('success')
        }
        else if(result === '권한 없음'){
            res.status(404).send('권한 없음')
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.readPostByNick = async (req,res,next) => {
    const result = await readPostByNick(req.params.nick)

    return res.send(result)
}