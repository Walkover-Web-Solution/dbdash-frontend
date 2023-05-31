import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Container, Typography } from '@mui/material';
import TextArea from '../TextArea/TextArea';
import { adminPanelByAI } from '../../api/dbApi';

const Chat = () => {
  const [messages, setMessages] = useState([]);

  const handleMessageSubmit = async (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    try {
      const response = await adminPanelByAI(message);
      const data = response.data;
      setMessages((prevMessages) => [...prevMessages, data.success]);
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <Container
      maxWidth="xl"
      
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
      }}
    >
      {/* <Typography variant="h3">AdminPanelByAI</Typography> */}
      <Container
        sx={{ height: '80vh', overflowY: 'auto' }}
      >
        <TransitionGroup>
          {messages.map((message, index) => (
            <CSSTransition key={index} timeout={500} classNames="message">
              <Typography variant='h6' className="message">{message}</Typography>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </Container>
      <TextArea onMessageSubmit={handleMessageSubmit} />
    </Container>
  );
};

export default Chat;
