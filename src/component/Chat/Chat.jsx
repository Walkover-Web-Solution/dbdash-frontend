import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { CircularProgress, Container, Typography } from '@mui/material';
import TextArea from '../TextArea/TextArea';
import { adminPanelByAI } from '../../api/dbApi';
import { Box } from '@mui/system';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleMessageSubmit = async (message) => {
    const actualMessage = "Question   :-" + message;
    const loadingKey = `loading-${messages.length}`;
  
    setMessages((prevMessages) => [
      ...prevMessages,
      { key: Date.now(), content: actualMessage },
      { key: loadingKey, content: <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "center" }}><CircularProgress /></Box> },
    ]);
    setIsLoading(true);
  
    try {
      const response = await adminPanelByAI(message);
      const data = response.data;
      const actual_response = "Answer   :-" + data.success;
  
      setTimeout(() => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const loadingIndex = updatedMessages.findIndex((msg) => msg.key === loadingKey);
          updatedMessages[loadingIndex] = { key: loadingKey, content: actual_response };
          setIsLoading(false);
          return updatedMessages;
        });
      }, 100);
    } catch (error) {
      setTimeout(() => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const loadingIndex = updatedMessages.findIndex((msg) => msg.key === loadingKey);
          const errorMessage = error.response.data["try again some error "];
          const errorContent = (
            <Typography
              variant='body1'
              sx={{ backgroundColor: '#ffcccc', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}
            >
              {errorMessage}
            </Typography>
          );
          updatedMessages[loadingIndex] = { key: loadingKey, content: errorContent };
          setIsLoading(false);
          return updatedMessages;
        });
      }, 100);
    }
  };
  



  return (
    <div style={{ backgroundColor: "#dadada", position: "relative", overflow: "hidden" }}>
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Container sx={{ height: '80%', overflow: 'auto' }}>
          <TransitionGroup>
            {messages.map((message, index) => (
              <CSSTransition key={message.key || index} timeout={500} classNames="message">
                {message.content ? (
                  <Typography
                    variant='body1'
                    className="message"
                    sx={{ backgroundColor: '#fff', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}
                  >
                    {message.content}
                  </Typography>
                ) : (
                  <Typography variant='body1' className="message" sx={{ fontStyle: 'italic', marginBottom: '8px' }}>
                    {message.key}
                  </Typography>
                )}
              </CSSTransition>
            ))}
          </TransitionGroup>
        </Container>
        <TextArea onMessageSubmit={handleMessageSubmit} isLoading={isLoading} />
      </Container>
    </div>
  );
};

export default Chat;
