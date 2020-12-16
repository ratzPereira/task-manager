//CRUD  -> create read update delete

//const mongodb = require('mongodb')
//const MongoClient = mongodb.MongoClient
//const ObjectID = mongodb.ObjectID  //to work with _ids
 
 //           /\ destructing \/

const { MongoClient, ObjectID} = require('mongodb')



const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID()
console.log(id.id.length) 
console.log(id.toHexString().length)



MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log ('Unable to connect to database!')
    } 
    
    const db = client.db(databaseName)


    //insert one
   /*  db.collection('users').insertOne({
        name: 'Joao',
        age: 26
    }, (error, result) => {
        if(error){
            return console.log('Something went wrong')
        }

        console.log(result.ops)  //   . ops ->  array of document inside
    })
 */
    //insert many 

   /*  db.collection('users2').insertMany([
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
    }) */

    //testing with task manager example

    /* db.collection('task_manager').insertMany([
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
})