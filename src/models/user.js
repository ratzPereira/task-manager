const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
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
        validate(value){
            if (value.length < 6) {
                throw new Error('Password must contain 6 characters or more')
            }

            if (value.includes('password')) {
                throw new Error('You cant set that password, try another one')
            }
        }
    }
})

module.exports = User