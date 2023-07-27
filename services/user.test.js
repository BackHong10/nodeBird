jest.mock('../models/user')
const User = require('../models/user')
const {Follow} = require('../services/user')


describe('follow', () => {
    const userId = 1
    const followId = 2
    test('user가 있을 경우', async () => {
        User.findOne.mockReturnValue({
            addFollowing(id){
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