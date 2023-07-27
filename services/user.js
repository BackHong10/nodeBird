const User = require('../models/user')


exports.Follow = async (userId, followId) => {
    const user = await User.findOne({
        where: {
            id: userId
        }
    })

    if(user){
        await user.addFollowing(parseInt(followId,10))
        return 'success'
    }
    else{
        return 'no user'
    }
}