const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
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
    }
})

userSchema.pre('save', async function (next) {   //we run this before the user is saved
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next() //end the function.
})

const User = mongoose.model('User', userSchema)

module.exports = User