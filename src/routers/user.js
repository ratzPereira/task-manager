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
    dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {          //file.originalname.endsWith('.jpg')  <- we can use this, but .match acept regular expressions, so, why not?
            return cb(new Error('File must be an image'))
        }
        
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.sendStatus(200)
})


module.exports = router