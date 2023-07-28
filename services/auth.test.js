jest.mock('../models/user')
jest.mock('bcrypt')
jest.mock('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {getAccessToken,join} = require('../services/auth')

describe('join', () => {
    const createInput = {
        email: 'fhwm0241',
        password: "1234",
        nick: 'zizon'
    }
    test('user가 있을 경우', async () => {
        User.findOne.mockReturnValue(Promise.resolve('hi'))
        User.create.mockReturnValue(Promise.resolve(true))
        const result = await join(createInput)
        expect(result).toEqual('exUser')
    })

    test('user가 없을 경우', async () => {
        User.findOne.mockReturnValue(null)
        User.create.mockReturnValue(Promise.resolve(true))
        const result = await join(createInput)
        expect(result).toEqual('success')
    })
})

describe('getAccessToken', () => {
    const email = 'fhwm0241'
    const password = '1234'
    const res = {
        setHeader: jest.fn()
    }
    test('성공', async () => {
        User.findOne.mockReturnValue(Promise.resolve('hi'))
        bcrypt.compare.mockReturnValue(Promise.resolve(true))
        jwt.sign.mockReturnValue('1234')
        const result = await getAccessToken(email,password,res)
        expect(result).toEqual(result)
    })

    test('user가 없을 경우', async () => {
        User.findOne.mockReturnValue(null)
       
        const result = await getAccessToken(email,password,res)
        expect(result).toEqual('no user')
    })

    test('비밀번호가 틀렸을 경우', async () => {
        User.findOne.mockReturnValue(Promise.resolve('hi'))
        bcrypt.compare.mockReturnValue(null)
        const result = await getAccessToken(email,password,res)
        expect(result).toEqual('different password')
    })
})