import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { CircularProgress, Container, Typography } from '@mui/material';
import TextArea from '../TextArea/TextArea';
import { adminPanelByAI } from '../../api/dbApi';
import { Box } from '@mui/system';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loader, setloader] = useState(false)
  const handleMessageSubmit = async (message) => {
    const actual_message = "Question   :-" + message
    setMessages((prevMessages) => [...prevMessages, actual_message]);
    try {
      const response = await adminPanelByAI(message);
       const data = response.data;
       const actual_response ="Answer   :-" + data.success
      setMessages((prevMessages) => [...prevMessages, actual_response]);
      setloader(false)
    } catch (error) {
         setMessages((prevMessages) => [...prevMessages, error.response.data["try again some error "] ]);
      setloader(false)
    }
  };
  

  return (
   <div style={{backgroundColor : "#dadada" , position : "relative" , overflow : "hidden"}}>
     <Container
      maxWidth="xl"
      
      sx={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
      }}
    >
      {/* <Typography variant="h3">AdminPanelByAI</Typography> */}
      <Container
        sx={{ height: '80%', overflow: 'auto' }}
      >
        {!loader?<TransitionGroup>
          {messages.map((message, index) => (
            <CSSTransition key={index} timeout={500} classNames="message">
              <Typography variant='h6' className="message">{message}</Typography>
            </CSSTransition>
          ))}
        </TransitionGroup>:<Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
}
      </Container>
      <TextArea onMessageSubmit ={(message)=>{setloader(true); handleMessageSubmit(message)}} />
    </Container>
   </div>
  );
};

export default Chat;
