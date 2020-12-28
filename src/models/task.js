const mongoose = require('mongoose')
const validator = require('validator')
const User = require('./user')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'   //reference to mongoose. set a relationship between user and tasks
    }
})


const Task = mongoose.model('Task', taskSchema)
module.exports = Task