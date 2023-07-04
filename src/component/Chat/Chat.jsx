import React, { useState, useRef, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import TextArea from "../TextArea/TextArea";
import { adminPanelByAI } from "../../api/dbApi";
import { Box } from "@mui/system";
import { useParams } from "react-router";
import { ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from "@mui/icons-material";

function checkEmptyValue(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!checkEmptyValue(item)) {
        return false;
      }
    }
    return true;
  } else if (typeof value === "object" && value !== null) {
    for (const key in value) {
      if (!checkEmptyValue(value[key])) {
        return false;
      }
    }
    return true;
  } else {
    return value === "";
  }
}

const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const messagesEndRef = useRef(null);



  const handleMessageSubmit = async (message) => {
    const actualMessage = "Question   :-" + message;
    const loadingKey = `loading-${messages.length}`;
    const index = Math.floor(messages.length / 2);

    setMessages((prevMessages) => [
      ...prevMessages,
      { key: Date.now(), content: actualMessage },
      {
        key: loadingKey,
        content: (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ),
      },
    ]);
    setIsLoading(true);

    try {
      const response = await adminPanelByAI(message, id);
      const data = response.data;
      console.log("data   :-", data);

      let myVariable;

      for (const key in data.success) {
        const value = data.success[key];

        if (checkEmptyValue(value)) {
          // Value is empty
          continue; // Skip to the next iteration
        } else {
          // Value is non-empty
          myVariable = value;
          break; // Exit the loop after finding the first non-empty value
        }
      }
      let code;
      console.log("myvariable   :-", myVariable);
      if (typeof myVariable === 'string') {
        // myVariable is already a string
        code = myVariable;
      } else {
        // myVariable is not a string, stringify it
        code = JSON.stringify(myVariable);
        console.log("myvariable  : -" , myVariable)
        console.log("cide   :-" , code)
      }

      // const code = JSON.stringify(myVariable) ;

      const actual_response = "Answer   :-" + code;

      const updatedLikes = { ...likes };
      const updatedDislikes = { ...dislikes };

      if (index % 2 !== 0) {
        if (!updatedLikes[index]) {
          updatedLikes[index] = 0;
        }
        if (!updatedDislikes[index]) {
          updatedDislikes[index] = 0;
        }
      }

      setLikes(updatedLikes);
      setDislikes(updatedDislikes);


      setTimeout(() => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const loadingIndex = updatedMessages.findIndex((msg) => msg.key === loadingKey);
          updatedMessages[loadingIndex] = {
            key: loadingKey,
            content: <div dangerouslySetInnerHTML={{ __html: actual_response }} />,
          };
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
              variant="body1"
              sx={{
                backgroundColor: "#ffcccc",
                padding: "8px",
                borderRadius: "4px",
                marginBottom: "8px",
              }}
            >
              {errorMessage}
            </Typography>
          );
          updatedMessages[loadingIndex] = {
            key: loadingKey,
            content: errorContent,
          };
          setIsLoading(false);
          return updatedMessages;
        });
      }, 100);
    }
  };



  const handleThumbUpClick = (index) => {
    setLikes((prevLikes) => {
      const updatedLikes = { ...prevLikes };
      if (updatedLikes[index]) {
        updatedLikes[index] -= 1;
      } else {
        updatedLikes[index] = 1;
      }
      return updatedLikes;
    });

    setDislikes((prevDislikes) => {
      const updatedDislikes = { ...prevDislikes };
      if (updatedDislikes[index]) {
        updatedDislikes[index] -= 1;
      }
      return updatedDislikes;
    });
  };

  const handleThumbDownClick = (index) => {
    setDislikes((prevDislikes) => {
      const updatedDislikes = { ...prevDislikes };
      if (updatedDislikes[index]) {
        updatedDislikes[index] -= 1;
      } else {
        updatedDislikes[index] = 1;
      }
      return updatedDislikes;
    });

    setLikes((prevLikes) => {
      const updatedLikes = { ...prevLikes };
      if (updatedLikes[index]) {
        updatedLikes[index] -= 1;
      }
      return updatedLikes;
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        backgroundColor: "#dadada",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Container sx={{ height: "80%", overflow: "auto", marginTop: "1rem" }} ref={messagesEndRef}>
          <TransitionGroup>
            {messages.map((message, index) => {
              const messageIndex = Math.floor(index / 2);
              const messageLikes = likes[messageIndex] || 0;
              const messageDislikes = dislikes[messageIndex] || 0;

              return (
                <CSSTransition key={message.key || index} timeout={500} classNames="message">
                  {message.content ? (
                    <Typography
                      variant="body1"
                      className="message"
                      sx={{
                        backgroundColor: index % 2 !== 0 ? "transparent" : "#fff",
                        padding: "8px",
                        borderRadius: "4px",
                        marginBottom: "8px",
                      }}
                    >
                      {message.content}
                      {index % 2 !== 0 && (
                        <div style={{ marginLeft: "85%", font: "10px" }}>
                          <Button onClick={() => handleThumbUpClick(messageIndex)} startIcon={messageLikes > 0 ? <ThumbUp /> : <ThumbUpOutlined />}>
                            {messageLikes}
                          </Button>
                          <Button onClick={() => handleThumbDownClick(messageIndex)} startIcon={messageDislikes > 0 ? <ThumbDown /> : <ThumbDownOutlined />}>
                            {messageDislikes}
                          </Button>
                        </div>
                      )}
                    </Typography>
                  ) : (
                    <Typography variant="body1" className="message" sx={{ fontStyle: "italic", marginBottom: "8px" }}>
                      {message.key}
                    </Typography>
                  )}
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </Container>
        <TextArea onMessageSubmit={handleMessageSubmit} isLoading={isLoading} />
      </Container>
    </div>
  );
};

export default Chat;