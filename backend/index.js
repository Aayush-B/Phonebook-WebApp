const http = require('http')
const cors = require('cors')
const express = require('express')
const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const mongoose = require('mongoose')
const password = 'ZlJWFxWvrQ42J1AU'
const url = `mongodb+srv://aayushbhanot04:${password}@cluster0.olgctgj.mongodb.net/phonebookapp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  Name: { 
    type: String,
    minLength: 2,
    required: true
  },
  Number: {
    type: String,
    minLength: 6,
    required: true

  
  }
  
  
  
})
const Person = mongoose.model('Person', phonebookSchema)

const person = new Person({
  Name: process.argv[3],
  Number: process.argv[4]
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
let Persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })

})





//Fetching a single resource
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    }
    else{
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

//Deleting Resources
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})
const generateId = () => {
  const randId = Math.floor(Math.random() * 100000000)
  return randId 
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)
  if (body === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  const person = new Person({
    Name: body.Name,
    Number: body.Number,
  })

  person.save().then(result => {
    console.log('note saved!')
    response.json(result)
  })
  .catch(error => next(error))

  
})

app.put('/api/persons/:id', (request, response, next) => {
  const {Name, Number} = request.body

  const person = ({
    id: body.id,
    Name: body.Name,
    Number: body.Number,
  })

  Person.findByIdAndUpdate(request.params.id, {Name, Number} , 
    { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedNum => {
      response.json(updatedNum)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)






//error handling
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }


  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})