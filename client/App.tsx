import React, { useEffect, useState } from 'react';
import './App.css'

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage] = useState<string[]>([]);
  // let inputMessage: string[] = [];
  const [input, setInput] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080');

    websocket.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    websocket.onmessage = async (event) => {
      if (event.data instanceof Blob) {
        const text = await event.data.text();
        console.log("text: ", text);
        const parsedMessage = JSON.parse(text);
        console.log("parsedMessage: ", parsedMessage);
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      } else {
        const parsedMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket Client Disconnected');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => { console.log(messages); console.log(inputMessage) })

  const checkWebSocketConnection = (): boolean => {
    return !!ws;
  }

  const checkInputIsNull = (): boolean => {
    return input.trim() !== '';
  }

  const addCurrentUserMessage = (): void => {
    inputMessage.push(input);
  }

  const sendMessage = () => {
    if (checkWebSocketConnection() && checkInputIsNull()) {
      ws?.send(JSON.stringify(input));
      setInput('');
      addCurrentUserMessage();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.code === 'Enter')
      sendMessage();
  }

  return (
    <div className="Chat">
      <h1>Online Chat</h1>
      <div className="Chat-messages">
        {messages.map((message, index) => (
          <div key={index} className="message left">{message}</div>
        ))}
      </div>
      <div className="Chat-inputMessages">
        {inputMessage.map((message, index) => (
          <div key={index} className="message right">{message}</div>
        ))}
      </div>
      <div className="Chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(event) => handleKeyPress(event)} // добавляем обработчик нажатия клавиши
        />
        <button onClick={sendMessage} id='sendMessageButton'>Send</button>
      </div>
    </div>
  );
};

export default Chat;
