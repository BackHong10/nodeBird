jest.mock('../models/user')
jest.mock('../models/post')
const User = require('../models/user')
const Post = require('../models/post')
const {Follow,unFollow,updateProfile,likePost} = require('../services/user')


describe('follow', () => {
    const userId = 1
    const followId = 2
    test('user가 있을 경우', async () => {
        User.findOne.mockReturnValue({
            addFollowings(id){
                return Promise.resolve(true)
            }
        })
        const result = await Follow(userId, followId)
        expect(result).toEqual('success')
    })

    test('user가 없을 경우', async () => {
        User.findOne.mockReturnValue(null)
        const result = await Follow(userId, followId)
        expect(result).toEqual('no user')
    })
})

describe('unFollow', () => {
    const userId = 1
    const followId = 2
    test('user가 있을 경우', async () => {
        User.findOne.mockReturnValue({
            removeFollowings(id){
                return Promise.resolve(true)
            }
        })
        const result = await unFollow(userId, followId)
        expect(result).toEqual('success')
    })

    test('user가 없을 경우', async () => {
        User.findOne.mockReturnValue(null)
        const result = await unFollow(userId, followId)
        expect(result).toEqual('no user')
    })

    test('removeFollowing 실패', async () => {
        User.findOne.mockReturnValue({
            removeFollowings(id){
                return Promise.reject(false)
            }
        })
        const result = await unFollow(userId, followId)
        expect(result).toEqual('error')
    })
})

describe('updateProfile', () => {
    const nick = 1
    const password = 2
    test('!nick && !password', async () => {
        const updateInput = {
            nick : null,
            password: null,
        }
        const result = await updateProfile(updateInput, 1)
        expect(result).toEqual('정보 없음')
    })

    test('성공', async () => {
        const updateInput = {
            nick : 'hi',
            password: '1234',
        }
        User.findOne.mockReturnValue(Promise.resolve(true))
        User.update.mockReturnValue(Promise.resolve(true))
        const result = await updateProfile(updateInput, 1)
        expect(result).toEqual('success')
    })
})

describe('likePost', () => {
    const userId = 1
    const postId = 1
    test('성공', async () => {
        const count = ['hi','hello']
        User.findOne.mockReturnValue({
            addPostLike(id){
                return Promise.resolve(true)
            }
        })
        Post.findOne.mockReturnValue({
            getUserLike(){
                return Promise.resolve(count)
            }
        })
        const result = await likePost(userId, postId)
        expect(result).toEqual(2)
    })
})