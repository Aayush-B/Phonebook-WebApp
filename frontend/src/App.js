import { useState, useEffect } from 'react'
import axios from 'axios'
import Notification from './components/notification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import PhonebookFormingComp from './components/phonebookForm'
import NewUserForm from './components/NewUserForm'
import { Button, Checkbox, Form, Input, notification, Space } from 'antd';

const App = () => {
  const baseUrl = '/api/numbers'

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  const [Newusername, setNewusername] = useState('') 
  const [NewUserpassword, setNewUserpassword] = useState('') 
  const [NewNameofUser, setNewNameofUser] = useState('')
  
  const [searchValue, setSearchValue] = useState("")
  const [persons, setPersons] = useState([]) 
  const [FilteredPersons, setFilteredPersons] = useState([]) 

  const [newName, setNewName] = useState('')
  const [newNum, setnewNum] = useState('')
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (desc) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button type="link" size="small" onClick={() => api.destroy()}>
          Destroy All
        </Button>
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>
          Confirm
        </Button>
      </Space>
    );
    api.open({
      message: 'Notification',
      description: desc,
      btn,
      key,
     
    });
  };



  const addName = (event) => {
    event.preventDefault()

    const newName2 = newName.trim()
    
    const personObject = {
      Name: newName2,
      Number: newNum,
    }
    
    let checkValid = true;
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    }
    persons.map((person) => {
      if (person.Name === newName2) {
        checkValid = false;

        if (window.confirm(`${newName2} is already added to phonebook, replace the old number with a new one one?`)) {
          axios
            .put(`/api/persons/${person.id}`, personObject, config)
            .then(response => {
             console.log(response.data)
             axios.get(`${baseUrl}`, config)
             .then(response => {
              console.log(`hereeee ${response.data}`)
               setPersons(response.data)
               setFilteredPersons(response.data)
               openNotification(`Updated ${newName2}'s number sucessfully`)
             })
       
            })
        }
      }
    })
    
    if (checkValid === true) {
      axios
      .post('/api/numbers', personObject, config)
      .then(response => {
        console.log(response.data)
        setPersons(persons.concat(response.data))
        setFilteredPersons(persons.concat(response.data))
        setNewName('')
        openNotification(`Added ${newName2}'s number sucessfully`)
       
      })
      .catch(error => {
        console.log(error)
      openNotification(error.response.data.error)
       })
    }

    setNewName('')
    setnewNum('')
 
  }
  

  const DeleteingNumber = (id, nameOfPerson) => {
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    }
    if (window.confirm(`Delete ${nameOfPerson}`)) {
      axios
      .delete(`/api/persons/${id}`,config)
      .then(() => {
        axios
        .get(baseUrl, config)
        .then(response => {
          console.log(response.data)
          setPersons(response.data)
          setFilteredPersons(response.data)
          setSearchValue('')
        })    
      })
    }
  }
  const loggingout = () =>{
    window.localStorage.clear()
    window.location.reload(false);

  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumChange = (event) => {
    setnewNum(event.target.value)
  }

  useEffect(() => {
    const newpersons = persons.filter(value => value.Name.toLowerCase().includes(searchValue.toLowerCase()))
    setFilteredPersons(newpersons)
  }, [searchValue])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      axios
        .get(`${baseUrl}`, config)
        .then(response => {
          console.log(response.data)
          setPersons(response.data)
          setFilteredPersons(response.data)
        })
        .catch(error => {
          loggingout()
        })
    }

  }, [])

  const handleLogin =async  (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )  
      setUser(user)
      setUsername('')
      setPassword('')
      window.location.reload(false);

    } catch (exception) {
      openNotification('Wrong credentials')
    }
  }
  const loginForm = () => {
   
    return(

      <LoginForm
      username = {username}
      password = {password}
      handleSubmit = {handleLogin}
     
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePassChange={({ target }) => setPassword(target.value)}
      />
    )
  
  }
  const phonebookForm = () => {

    return(
      <PhonebookFormingComp 
    
      addnamecomp = {addName}
    handlenamechangecomp = {handleNameChange}
    newnamecomp = {newName}
    newnumcomp = {newNum}
    handlenumchange = {handleNumChange}
    loggingoutcomp = {loggingout}
      />
      
    )
  }
    const searchField = () => (
      
      <div style={{
        width: '25%',
          margin: 'auto',
        borderWidth: "5px",
      }} >
        
      <Input type="text" onChange={(e) => setSearchValue(e.target.value)} value={searchValue} placeholder="Search by name"/>
      </div>

    )



  const newUser = (event) => {
    event.preventDefault()
    const userObj = {
      username: Newusername,
      name: NewNameofUser,
      password: NewUserpassword
    }
    axios
    .post('/api/users', userObj)
    .then(response => {
      openNotification(`Added user sucessfully`)
      setNewusername('')
      setNewNameofUser('')
      setNewUserpassword('')
    })
    .catch(error => {
      console.log(error)
      openNotification(error.response.data.error)
    })
  }

  const newUserform = () => {
    return(
      <NewUserForm

      handleSubmit = {(e) => newUser(e)}
      handlenewusername = {(e) => setNewusername(e.target.value)}
      newusername = {Newusername}
      
      handlenewnameofuser = {(e) => setNewNameofUser(e.target.value)}
      newunameofuser = {NewNameofUser}
      handlenewpass = {(e) => setNewUserpassword(e.target.value)}
      newpassofuser = {NewUserpassword}
      />
    )
  }
        

  
  
  const filteredNums = () => (
    <div  style={{
      width: '25%',
      margin: 'auto',
    borderWidth: "5px",
    }}>
      <h2 style = {{color: '#9fd3c7'}}> Filtered Numbers</h2>   
      <ul>
        {FilteredPersons.map((item, index, number) => (
      
      <div key = {index}>
          <div style = {{marginBottom: '10px'}} > <h3 style = {{color: '#9fd3c7'}}>Name: {item.Name} Number: {item.Number}  </h3>    </div>
          <Button style={{color: '#233142',marginBottom: '10px',
                  backgroundColor: '#9fd3c7'}} type="primary" onClick={() => { DeleteingNumber(item.id, item.Name) }}> Delete Entry </Button>
        </div>
        
        ))}
      </ul>
    </div>   
  )
  
  return (
    <body style = {{backgroundColor: '#385170',
    height: '100vh',
    width: "100%",
    margin: '0',
    padding: '0.1px',
    
    
    }}>
    {contextHolder}
    <div>
      <div style={{textAlign: 'center'}}>
        <h2 style={{
                fontSize: "50px",
                color: '#9fd3c7'
              }}>Phonebook App</h2>
      </div>

      {/* <Notification message={notifMessage}/> */}



    {!user && loginForm()} 
    {!user && newUserform()} 
    {user && <div>
       <p style={{
                fontSize: "20px",
                color: '#9fd3c7',
                textAlign: 'center'
              }}>{user.name} logged in</p>
       
       {phonebookForm()}
       {searchField()}
       {filteredNums()}
      </div>
    }




    </div>
    </body>
  )
}

export default App