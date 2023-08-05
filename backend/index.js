const http = require('http')
const cors = require('cors')
const express = require('express')
const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();
const MONGO_PASS = process.env.MONGO_PASSWORD

const url = `mongodb+srv://aayushbhanot04:${MONGO_PASS}@cluster0.olgctgj.mongodb.net/phonebookapp?retryWrites=true&w=majority`
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('strictQuery',false)
mongoose.connect(url)

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const bcrypt = require('bcrypt')

const phonebookSchema = new mongoose.Schema({
   Name: { 
    type: String,
    minLength: 2,
    required: true
  },
  Number: {
    type: String,
    minLength: 6,
    required: false,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Should be in format XXX-XXX-XXXX`
    }
  },
  user: String,
})
phonebookSchema.plugin(uniqueValidator)
phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Person = mongoose.model('Person', phonebookSchema)


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,

  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
    minLength: 3,
  },
  persons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
})
userSchema.plugin(uniqueValidator)
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})
const User = mongoose.model('User', userSchema)

const tokenExtractor = (request, response, next) => {
  // code that extracts the token
  request.token = getTokenFrom(request)
  next()
}
const userExtractor = (request, response, next) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  request.user = decodedToken.id
  next()
}

app.use('/api/numbers', tokenExtractor, userExtractor)
app.use('/api/persons/:id', tokenExtractor, userExtractor)

//login method - to make existing users login
app.post('/api/login', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60*60 }
  )
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

//to make existing users add to their phonebook
app.post('/api/numbers', async (request, response, next) => {

  const body = request.body
  
  try {
    const user = await User.findById(request.user)
  
    const person = new Person({
      Name: body.Name,
      Number: body.Number,
      user: user.id
  
    })
  
    const savedPerson = await person.save()
    user.persons =   user.persons.concat(savedPerson._id)
    await user.save()
    
    response.json(savedPerson)

  } catch (error) {
    next(error)

  }

})

//get existing users phonebook entries
app.get('/api/numbers', async (request, response, next) => {

  try {
    const user = await User.findById(request.user).populate('persons', {Name: 1, Number: 1})
  
    response.json(user.persons)

  } catch (error) {
    next(error)

  }

})

//Deleting a phonebook entry made by a specific user
app.delete('/api/persons/:id', async (request, response, next) => {
  
  try {
    const user =  await User.findById(request.user)
    const person =  await Person.findById(request.params.id)
   
    if ( person.user.toString() === user.id.toString() ) {  
      await Person.findByIdAndRemove(request.params.id) 
    }
    else {
      return response.status(401).json({
        error: 'You do not have such an entry'
      })
    }
    
      response.status(204).end()

  } catch (error) {
    next(error)

  }
})

//to create new users 
app.post('/api/users', async (request, response, next) => {
  const { username, name, password } = request.body
  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username: username,
      name: name,
      passwordHash: passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.status(200).json(savedUser)
  } catch (e) {
    next(e)
  }
})

app.get('/api/users', async (request, response) => {


    const users = await User.find({}).populate('persons', {Name: 1, Number: 1})
    response.json(users)


  })
  

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

app.put('/api/persons/:id', (request, response, next) => {
  const {Name, Number} = request.body

 
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
  console.error(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}



// this has to be the last loaded middleware.
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
