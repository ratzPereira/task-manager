const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')



const userOne = {
    name: "Test User",
    email: "TestUser@email.com",
    password: "123fortester"
}


beforeEach( async () => {
    await User.deleteMany()
    await new User(userOne).save()
})



test('Should sign up a new user', async () => {
    await request(app).post('/users').send({
        name: "Ratz",
        email: "example@test.com",
        password: "4rt3r2rrwras"
    }).expect(201)

})


test('Should log in existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})


test('Should not to be able to login', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: "password"
    }).expect(400)
})