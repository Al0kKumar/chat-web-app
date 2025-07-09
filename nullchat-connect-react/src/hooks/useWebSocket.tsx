import { useEffect, useRef } from 'react';

type MessageHandler = (msg: any) => void;

export const useWebSocket = (
  token: string,
  onMessage: MessageHandler
) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket(`wss://chat-web-app-6330.onrender.com?token=${token}`);

    socket.onopen = () => {
      console.log('🔌 WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📥 Incoming WS message:', data);
      onMessage(data);
    };

    socket.onclose = (event) => {
      console.log('❌ WebSocket closed:', event.reason);
    };

    socket.onerror = (err) => {
      console.error('❗ WebSocket error:', err);
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, [token]);

  const sendMessage = (msg: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  };

  return { sendMessage };
};
