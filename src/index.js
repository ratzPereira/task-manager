const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const { ObjectID } = require('mongodb')
const { updateOne } = require('./models/user')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 4000


//middleware example \/

/* app.use((req, res, next) => {
    res.status(503).send('The server is in maintenance')
}) */


app.use(express.json()) // automatic parse json in object
app.use(userRouter)
app.use(taskRouter)


//
//  Without middleware: new request -> run route handler
//
//
//  with middleware: new request -> do something -> run route handler
//


app.listen(port, () => {
    console.log('Server is running on port ' + port)
})





