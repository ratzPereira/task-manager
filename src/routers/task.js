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

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt:asc
///tasks?sortBy=createdAt:asc&completed=true
router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}   //we create one empty object so we can costumize this



    if (req.query.completed) {
        match.completed = req.query.completed === 'true'   //we get a string comming from req. we want one boolean
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 //grabbing the fist item in the parts array and using it as the name of the property, then
        //we check via ternary if the given value is desc or asc and set that to 1 or -1
    }

try {
    //const tasks = await Task.find({owner: req.user._id}) // prcurar todas as task do user que está autenticado


    //  \/ another approach
    await req.user.populate({
        path: 'tasks',
        match,
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
    }).execPopulate() //will fetch and populate the user tasks


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