const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')





router.post('/task', auth, async (req,res) => {
   
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
try {
    await task.save()
    res.status(201).send(task)
} catch (error) {
    res.status(400).send(error)
}
})


router.get('/tasks', auth, async (req, res) => {

try {
    //const tasks = await Task.find({owner: req.user._id}) // prcurar todas as task do user que está autenticado


    //  \/ another approach
    await req.user.populate('tasks').execPopulate() //will fetch and populate the user tasks
    res.send(req.user.tasks)
} catch (error) {
    res.status(500).send()
    }
})



router.get('/task/:id', auth, async (req, res) => {
const _id = req.params.id

try {
    const task = await Task.findOne({_id, owner: req.user._id})
    
    if(!task){
        return res.status(404).send()
    }
    res.send(task)
} catch (error) {
    res.status(500).send()
    }
})


router.patch('/task/:id', auth, async (req, res) => {
const updates = Object.keys(req.body)
const allowedUpdates = ['description', 'completed']
const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

if(!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates!'})
}

try {

    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

    
    //const task = await Task.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true })

    if(!task){
        return res.status(404).send()
    }

    updates.forEach((update) => task[update] = req.body[update])
    await task.save()
    res.send(task)
} catch (error) {
    res.status(400).send(error)
    }
})

router.delete('/task/:id', auth, async (req, res) => {

try {
    
    const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

    if (!task) {
        return res.status(404).send()
    }
    res.send(task)
} catch (error) {
    res.status(500).send()
}
})




module.exports = router