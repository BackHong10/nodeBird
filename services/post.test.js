jest.mock('../models/post')
jest.mock('../models/user')
jest.mock('../models/hashtag')
const Post = require('../models/post')
const User = require('../models/user')
const Hashtag = require('../models/hashtag')
const {uploadPost,updatePost,deletePost,readPostByNick} = require('../services/post')

describe('uploadPost',  () => {
    const postInput = {
        content: '안녕하세요',
        url : 'hi'
    }
    const arr = ['고양이','강아지']
    const userId = 1
    test('성공', async () => {
        

        Post.create.mockReturnValue({
            addHashtags(arr){
                return Promise.resolve(true)
            }
        })

        Hashtag.findOrCreate.mockReturnValue(Promise.resolve(true))

        const result = await uploadPost(postInput,userId)
        expect(result).toEqual('success')

    })
})

describe('updatePost',  () => {
    const content = '안녕하세요'
    const postId = 1
    const userId = 1
    test('성공', async () => {
        

        Post.findOne.mockReturnValue(Promise.resolve(true))

        Post.update.mockReturnValue(Promise.resolve(true))

        const result = await updatePost(content,postId,userId)
        expect(result).toEqual('success')

    })

    test('실패', async () => {
        

        Post.findOne.mockReturnValue(null)

        Post.update.mockReturnValue(Promise.resolve(true))

        const result = await updatePost(content,postId,userId)
        expect(result).toEqual('수정권한이 없음')

    })
})

describe('deletePost',  () => {
    
    const postId = 1
    const userId = 1
    test('성공', async () => {
        

        Post.findOne.mockReturnValue(Promise.resolve(true))

        Post.destroy.mockReturnValue(Promise.resolve(true))

        const result = await deletePost(postId,userId)
        expect(result).toEqual('success')

    })

    test('실패', async () => {
        

        Post.findOne.mockReturnValue(null)

        Post.destroy.mockReturnValue(Promise.resolve(true))

        const result = await deletePost(postId,userId)
        expect(result).toEqual('권한 없음')

    })
})

describe('readPostByNick',  () => {
    
    const nick = 'zizon'
    test('성공', async () => {
        
        const arr = [
            {
                "id": 1,
                "content": "#고양이 #귀여움\r\n고양이 너무 귀엽다",
                "img": "",
                "createdAt": "2023-07-28T05:24:57.000Z",
                "updatedAt": "2023-07-28T05:24:57.000Z",
                "UserId": 1,
                "User": {
                    "id": 1,
                    "email": "aaa01@aaa.com",
                    "nick": "zizon",
                    "password": "$2b$10$jjcMyEx9w8QJPsPVAjYI7.1K/DZLhH2EQ/X2vaRxh1E9.om2ZCpGm",
                    "provider": "local",
                    "snsId": null
                }
            }
        ]
        Post.findAll.mockReturnValue(arr)

        

        const result = await readPostByNick(nick)
        expect(result).toEqual(arr)

    })

   
})