const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div  style={{
        
        
        color: 'blue', 
        fontSize : '15px', 
        padding: '10px',
        marginBottom: '10px',
        background: 'lightgrey',

        
        
        }}>
        {message}
      </div>
    )
  }
export default Notification;

