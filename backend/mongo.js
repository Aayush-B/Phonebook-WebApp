const mongoose = require('mongoose')
const password = process.argv[2]
const url = `mongodb+srv://aayushbhanot04:${password}@cluster0.olgctgj.mongodb.net/phonebookapp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const phonebookSchema = new mongoose.Schema({
    Name: String,
    Number: String,
})
const Person = mongoose.model('Person', phonebookSchema)

const person = new Person({
    Name: process.argv[3],
    Number: process.argv[4]
})

if (process.argv.length < 4) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.Name} ${person.Number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length == 5) {
    person.save().then(result => {
        console.log(`added ${person.Name} number ${person.Number} to phonebook`)
        mongoose.connection.close()
        console.log(result)
    })
} else {
    console.log('ending mongo connection')
    mongoose.connection.close()
}


