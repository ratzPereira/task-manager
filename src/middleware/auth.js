const jwt = require('jsonwebtoken')
const User = require('../models/user')



const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '') // we take the token coming from the header , and we remove the word Bearer by replace with nothing
        const decoded = jwt.verify(token, process.env.JWT_SECRET)  // jwt will check if the token is valid
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) //will associate the token to a user
        
        if(!user) {
            throw new Error()
        }

        req.token = token  //this particular token
        req.user = user     //this particular user
        next()
    } catch (error) {
        res.status(401).send({error: 'Please loggin first!'})
    }
}




module.exports = auth