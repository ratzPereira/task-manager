require('../src/db/mongoose')
const User = require('../src/models/user')
const Task = require('../src/models/task')


/* User.findByIdAndUpdate('5fda34f539cf8b04acb5bae7', { age:69}).then((user) =>{
    console.log(user)

    return User.countDocuments({age: 69})
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
}) */

//example of async await function
/* const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count

}

updateAgeAndCount('5fda34f539cf8b04acb5bae7', 100).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
}) */









/* Task.findByIdAndUpdate('5fdcadb3acf58c1258168fbb', {completed: true}).then((task) => {
    console.log(task)

    return Task.countDocuments({completed: true})
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
}) */

//second example of async and await

const deleteTaskByIdAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
     
}

deleteTaskByIdAndCount('5fdcadb3acf58c1258168fbb').then((result) => {
    console.log('You need to complete ' + result + ' tasks!')
}).catch((e) => {
    console.log(e)
}) 

