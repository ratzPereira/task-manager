//CRUD  -> create read update delete

//const mongodb = require('mongodb')
//const MongoClient = mongodb.MongoClient
//const ObjectID = mongodb.ObjectID  //to work with _ids
 
 //           /\ destructing \/

const { MongoClient, ObjectID} = require('mongodb')



const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

//const id = new ObjectID()
//console.log(id.id.length) 
//console.log(id.toHexString().length)



MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log ('Unable to connect to database!')
    } 
    
    const db = client.db(databaseName)


    db.collection('task_manager').deleteMany({
        done: true
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

})












 /*   //insert one
    db.collection('users').insertOne({
        name: 'Joao',
        age: 26
    }, (error, result) => {
        if(error){
            return console.log('Something went wrong')
        }

        console.log(result.ops)  //   . ops ->  array of document inside
    })
 
    //insert many 

    db.collection('users2').insertMany([
        {
            name: 'Jen',
            age: 22, 
        }, {
            name: 'Jonny',
            age: 33
        }
    ], (error, result) => {
        if (error){
            'Something went wrong'
        }

        console.log(result.ops)
    })

    //testing with task manager example

     db.collection('task_manager').insertMany([
        {
            task: 'study Node.js',
            done: true
        }, {
            task: 'sleep',
            done:false 
        }
    ], (error, result) => {
        if(error) {
            return console.log('Something went wrong')
        }

        console.log(result.ops)
    }) */


    /* // find one and the first
    db.collection('users').findOne({name: 'Joao'}, (error, user) => {
        if (error) {
            return console.log('Something went bad')
        }

        console.log(user)
    }) */
 
    /* //find all docs
    db.collection('users').find({ name: 'Joao' }).toArray((error, users) => {
        console.log(users)
    })

    db.collection('users').find({ name: 'Joao' }).count((error, count) => {
        console.log(count)
    }) */


    //update one and many example  


    /* db.collection('users2').updateOne({
        _id: new ObjectID("5fd9f0f8bca22e2a2c45fe4f"), 
    }, {
        $inc: {
            age: 1
        }
    }).then((result) => {
        console.log(result)
    }).catch((error)=> {
        console.log(error)
    }) */


   /*  db.collection('task_manager').updateMany({
        done: false
    }, {
        $set: {
            done: true
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    }) */