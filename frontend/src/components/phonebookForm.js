import { Button, Checkbox, Form, Input } from 'antd';

const PhonebookFormingComp = ({
    addnamecomp,
    handlenamechangecomp,
    newnamecomp,
    newnumcomp,
    handlenumchange,
    loggingoutcomp,
    
    }) => {
        return (
            <form onSubmit={addnamecomp}
            style={{
              width: '25%',
              margin: 'auto'

            }}
            >
              <h1 style = {{color: '#9fd3c7'}}>Add New Entry</h1>
      
              <div>
                  <Input
                value={newnamecomp}
                onChange={handlenamechangecomp}
                type="text"
                placeholder='Name'
                size='large'
                style = {{
                  marginBottom: '10px'
                }}
              />
              </div>
              <div> <Input  value={newnumcomp}
                onChange={handlenumchange}
                type="text"
                placeholder='Number'
                size='large'
                style = {{
                  marginBottom: '10px'
                }}
                /></div>
        <br></br>
              <div>
                <Button type="primary" htmlType="submit" 
                 style = {{
                  color: '#233142',
                  backgroundColor: '#9fd3c7',
                  marginBottom: '10px'
                }}
                >Add</Button>
              </div>

              <Button  type="primary" htmlType="submit" onClick={loggingoutcomp}    style = {{
                  color: '#233142',
                  backgroundColor: '#9fd3c7',
                  
                }}> Logout </Button>
              <br></br> 
              <br></br> 
              <br></br> 

            </form>
            

    )
    
    }
    export default PhonebookFormingComp