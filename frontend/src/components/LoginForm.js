import { Button, Checkbox, Form, Input } from 'antd';

const LoginForm = ({
handleSubmit,
handleUsernameChange,
handlePassChange,
username,
password

}) => {
    return (

    <div style={{
          width: '25%',
          margin: 'auto'

        }}> 
        <form onSubmit={handleSubmit}>
                <h1 style = {{color: '#9fd3c7'}}> Login
 </h1>

      <div>
        
          <Input
          type="text"
          value={username}
          name="Username"
          onChange={handleUsernameChange}
          placeholder='Username'
          size='large'
          style = {{
            marginBottom: '10px'
          }}
        />
      </div>
      <div>
        
          <Input
          type="password"
          value={password}
          name="Password"
          onChange={handlePassChange}
          placeholder='Password'
          size='large'
          style = {{
            marginBottom: '10px'
          }}

        />
      </div>
      <br></br>
      <Button type="primary" htmlType="submit" style={{ color: '#233142',
                  backgroundColor: '#9fd3c7',
                  }}>login</Button>
    </form>  
    <br></br>  
    <br></br> 
    <br></br> 
    </div>
)

}
export default LoginForm