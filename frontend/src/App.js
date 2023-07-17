import { useState, useEffect } from 'react'
import axios from 'axios'
import Notification from './components/notification'
const App = () => {
  const baseUrl = '/info'



  
  const [searchValue, setSearchValue] = useState("")
  const[notifMessage, setNotifMessage] = useState(null);
  const [persons, setPersons] = useState([]) 
  const [FilteredPersons, setFilteredPersons] = useState([]) 

  let id;
  const [newName, setNewName] = useState('')
  const [newNum, setnewNum] = useState('')

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    const newName2 = newName.trim()
    
    const personObject = {
      Name: newName2,
      Number: newNum,
    }
    
    let checkValid = true;

    persons.map((person) => {
      if (person.Name === newName2) {
        checkValid = false;

        if (window.confirm(`${newName2} is already added to phonebook, replace the old number with a new one one?`)) {
          axios
            .put(`/api/persons/${person.id}`, personObject)
            .then(response => {
             console.log(response.data)
             axios.get('/info')
             .then(response => {
               setPersons(response.data)
              setNotifMessage(`Updated ${newName2}'s number sucessfully`)
              setTimeout(() => {
                setNotifMessage(null)
              }, 5000)
             })
            })
           
            

        }
      }
    })

    if (checkValid === true) {
      axios
      .post('/api/persons', personObject)
      .then(response => {
        console.log(response.data)
        setPersons(persons.concat(response.data))
        setNewName('')
        setNotifMessage(`Added ${newName2}'s number sucessfully`)
        setTimeout(() => {
          setNotifMessage(null)
        }, 2000)
      })
   
    }

    setNewName('')
    setnewNum('')
 
  }
  

  const DeleteingNumber = (id, nameOfPerson) => {
    console.log(id)
    if (window.confirm(`Delete ${nameOfPerson}`)) {
      axios
      .delete(`/api/persons/${id}`)
      .then(() => {
        axios
        .get('/info')
        .then(response => {
          console.log(response.data)
          setPersons(response.data)
        })    
      })
    }
  }
  
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumChange = (event) => {
    console.log(event.target.value)
    setnewNum(event.target.value)
  }

  useEffect(() => {
    const newpersons = persons.filter(value => value.Name.toLowerCase().includes(searchValue.toLowerCase()))
    setFilteredPersons(newpersons)
  }, [searchValue])

  useEffect(() => {
    console.log('effect')
    axios
      .get(`${baseUrl}`)
      .then(response => {
        console.log('promise fulfilled')
        console.log(response.data)
        setPersons(response.data)
      })
  }, [])
  
  return (
    <div>
      <h2>Phonebook</h2>
      <input type="text" onChange={(e) => setSearchValue(e.target.value)} value={searchValue} placeholder="Search by name"/>


      <form onSubmit={addName}>
    
        <div>
          name:   <input
          value={newName}
          onChange={handleNameChange}
        />
        </div>
        <div>number: <input  value={newNum}
          onChange={handleNumChange}
          /></div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>


      <h2>Numbers</h2>   
      <Notification message={notifMessage}/>
       <ul> 
        {persons.map((item, index) => (
          <div key = {index}>
            <div> Name: {item.Name}     Number: {item.Number}   </div>
            <button onClick={() => { DeleteingNumber(item.id, item.Name) }}> Delete Entry </button>
          </div>
        ))}
       </ul>
       <h2> Filtered Numbers</h2>   
       <ul> 
        {FilteredPersons.map((item, index, number) => (
          <div key = {index}>
            <div> Name: {item.Name}     Number: {item.Number}   </div>
          </div>
        ))}
       </ul>
    </div>
  )
}

export default App