const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error ('Email invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error ('Age must be positive')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength:7,
        validate(value){
            if (value.includes('password')) {
                throw new Error('You cant set that password, try another one')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
       type: Buffer
    }
}, {     //this second object as argument is the schema options
    timestamps: true
})

userSchema.virtual('tasks', {                      //mongoose to figure out how these two things are related
    ref: 'Task',
    localField: '_id',    // in the task model we have owner ID and in user model we have the ID. its the field that those entities share
    foreignField: 'owner'   // relação entre Task e owner, em k o field comum é o _id
})           


userSchema.methods.toJSON = function () {   //toJSON -> 
    const user = this
    const userObject = user.toObject()

    delete userObject.password  //will delete the password field that is sending back
    delete userObject.tokens //will delete the tokens array field that is sending back

    return userObject
}


userSchema.methods.generateAuthToken = async function () {   //.methods -> instance methods
    const user = this
    const token = jwt.sign( { _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()
    
    return token
}


userSchema.statics.findByCredentials = async (email, password) => {  //. statics -> Model methods
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


userSchema.pre('save', async function (next) {   //we run this before the user is saved
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next() //end the function.
})

//Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id})
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User