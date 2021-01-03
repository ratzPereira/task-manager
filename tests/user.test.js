const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')
const { send } = require('@sendgrid/mail')


const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "Test User",
    email: "TestUser@email.com",
    password: "123fortester",
    tokens: [{
        token : jwt.sign({ _id: userOneId}, process.env.JWT_SECRET)
    }]
}


beforeEach( async () => {
    await User.deleteMany()
    await new User(userOne).save()
})



test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: "Ratz",
        email: "example@test.com",
        password: "4rt3r2rrwras"
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Ratz',
            email: "example@test.com" 
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe("4rt3r2rrwras")

})


test('Should log in existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

})


test('Should not to be able to login', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: "password"
    }).expect(400)
})


test('Should read the user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})


test('Should fail when trying to read a profile not logged in', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})


test('Delete user account', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        const user = await User.findById(userOneId)
        expect(user).toBeNull()
})


test('Cant delete account unauthorized', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})