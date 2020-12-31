const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')






router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    } 
})


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send()
    }
})

//logout current token
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//logout in every devices (clean all tokens)
router.post('/users/logoutALL', auth, async (req, res) => {
    try {
        
        req.user.tokens = []
        await req.user.save()

        res.send()

    } catch (error) {
        res.status(500).send()
    }
})


router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)  // the middleware already has the user that is logged in. we just need to send it back. its own profile
})



router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid operation'})
    }

    try {

        const user = await req.user

        updates.forEach((update) => user[update] = req.body[update]) // por cada field na array updates, update conforme o user enviou 
        await user.save()

        //const user =  await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error) 
    }
})


router.delete('/users/me', auth, async (req, res) => {
    try {
        
        await req.user.remove()
        
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})


//file uploading

const upload = multer({
    //dest: 'avatar',  // -> if we wanted to save files in one directory
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {          //file.originalname.endsWith('.jpg')  <- we can use this, but .match acept regular expressions, so, why not?
            return cb(new Error('File must be an image in jpg, jpeg or png'))
        }
        
        cb(undefined, true)
    }
})


//add or update users avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar =  req.file.buffer
    await req.user.save()
    res.sendStatus(200)
}, (error, req, res, next) => {   // must be with this 4 arguments so express know that function its for error handling
    res.status(400).send({error: error.message})
})


//delete users avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})


module.exports = router