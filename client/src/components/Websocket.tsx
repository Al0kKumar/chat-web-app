import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (token: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    // Establish WebSocket connection
    ws.current = new WebSocket(`ws://localhost:8080?token=${token}`);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMessage]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [token]);

  // Send message via WebSocket
  const sendMessage = (recipientId: string, message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const payload = {
        recipientId,
        message,
      };
      ws.current.send(JSON.stringify(payload));
    }
  };

  return { messages, sendMessage };
};
