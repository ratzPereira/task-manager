const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOne, userOneId, setupDatabase, taskOne, userTwo } = require('./fixtures/db')


beforeEach(setupDatabase)


test('Should create task for user ', async () => {
    const response = await request(app)
        .post('/task')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Test task',
            completed: true
        }).expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(true)
})

test('Should read all tasks for userOne', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})



test('Should fail to delete others user task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
       
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()

})

