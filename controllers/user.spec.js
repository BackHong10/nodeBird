
jest.mock('../models/user')
jest.mock('../services/user')
const User = require('../models/user')
const {follow} = require('./user')
const {Follow} = require('../services/user')

describe('follow', () => {
    const req = {
        user : {
            id: 1
        },
        params: {
            id : 2
        }
    }
    const res = {
        send: jest.fn(),
    }
    const next = jest.fn()
    test('user가 존재하면 성공응답', async () => {
        Follow.mockReturnValue(Promise.resolve('success'))
        await follow(req,res,next)
        expect(res.send).toBeCalledWith('success')
    })

    test('user가 존재하지 않으면 에러 응답', async () => {
        Follow.mockReturnValue(Promise.resolve('no user'))
        await follow(req,res,next)
        
        expect(res.send).toBeCalledWith('no user')
    })
    test('findOne에서 에러발생시', async () => {
        const message = 'DB에러'
        Follow.mockReturnValue(Promise.reject(message))
        await follow(req,res,next)
        expect(next).toBeCalledWith(message)
    })
    
})