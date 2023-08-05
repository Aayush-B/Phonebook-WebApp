import { Button, Checkbox, Form, Input } from 'antd';

const NewUserForm = ({
    handleSubmit,
    handlenewusername,
    newusername,
    
    handlenewnameofuser,
    newunameofuser,
    handlenewpass,
    newpassofuser,

    }) => {
        return (
    
            <form name="basic" onSubmit={handleSubmit}  style={{
              width: '25%',
              margin: 'auto'
            }}>
            <h1 style = {{color: '#9fd3c7'}}>Create New User</h1>
          <div>

              <Input
              placeholder='Username'
              type="text"
              value={newusername}
              name="Username"
              onChange={handlenewusername}
              size='large'
              style = {{
                marginBottom: '10px'
              }}
            />
          </div>
          <div>
            
              <Input
              type="text"
              placeholder='Name'
              value={newunameofuser}
              name="Name"
              onChange={handlenewnameofuser}
              size='large'
              style = {{
                marginBottom: '10px'
              }}
            />
          </div>
          <div>
            
              <Input
              type="password"
              placeholder='Password'
              value={newpassofuser}
              name="Password"
              onChange={handlenewpass}
              size='large'
              style = {{
                marginBottom: '10px'
              }}
            />
          </div>
          <br></br>
          <Button type="primary" htmlType="submit" 
          style = {{ color: '#233142',
          backgroundColor: '#9fd3c7',
          }}
          >Create</Button>
        </form>   
    )
    
    }
    export default NewUserForm

    /*
      <form onSubmit={(e) => newUser(e)}>
      <h1>Create New User</h1>
    <div>
      username
        <input
        type="text"
        value={Newusername}
        name="Username"
        onChange={(e) => setNewusername(e.target.value)}
      />
    </div>
    <div>
      name
        <input
        type="text"
        value={NewNameofUser}
        name="Name"
        onChange={(e) => setNewNameofUser(e.target.value)}
      />
    </div>
    <div>
      password
        <input
        type="password"
        value={NewUserpassword}
        name="Password"
        onChange={(e) => setNewUserpassword(e.target.value)}
      />
    </div>
    <button type="submit">Create</button>
  </form>  
   */