// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Send } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { useWebSocket } from '@/hooks/useWebSocket';

// const ChatPage = () => {
//   const { conversationId } = useParams();
//   const navigate = useNavigate();

//   const [newMsg, setNewMsg] = useState('');
//   const [messages, setMessages] = useState<any[]>([]);
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   const user = JSON.parse(localStorage.getItem('user') || '{}');
//   const token = localStorage.getItem('token') || '';

//   const wsRef = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     if (!token || !user.id) return;

//     let ws: WebSocket;
//     let reconnectAttempts = 0;

//     const connect = () => {

//     ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?token=${token}`);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log('✅ WebSocket connected');
//     };

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);

//       if (data.message === 'Welcome from WebSocket server') return;

//       if (data.unreadMsgs) {
//         const formatted = data.unreadMsgs.map((m: any) => ({
//           ...m,
//           isOwn: m.senderid === user.id,
//           time: 'Unread', // Placeholder, ideally from server
//         }));
//         setMessages((prev) => [...prev, ...formatted]);
//       } else {
//         setMessages((prev) => [
//           ...prev,
//           {
//             ...data,
//             isOwn: data.senderid === user.id,
//             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           },
//         ]);
//       }
//     };

//     ws.onclose = () => {
//       console.log('❌ WebSocket disconnected');
//       if(reconnectAttempts < 5){
//         setTimeout(connect, 1000* Math.pow(2,reconnectAttempts++));
//       }
//     };

//   };

    
//   connect();

//     return () => {
//       ws.close();
//     };
//   }, [token, user.id]);

//   const handleSend = () => {
//     if (!newMsg.trim()) return;

//    console.log("👉 handleSend fired", newMsg);

//    if (!wsRef.current || wsRef.current.readyState !== 1) {
//     console.warn("⚠️ WebSocket not connected", wsRef.current?.readyState);
//     return;
//   }

//     const message = {
//       senderid: user.id,
//       receiverid: Number(conversationId),
//       content: newMsg,
//     };

//     console.log("📤 Sending message:", message);

//     try {
//       wsRef.current.send(JSON.stringify(message));
//     } catch (err) {
//       console.error("❌ Failed to send message", err);
//     }

//     setMessages((prev) => [
//       ...prev,
//       {
//         ...message,
//         isOwn: true,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       },
//     ]);

//     setNewMsg('');
//   };

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   return (
//     <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
//         <div className="flex items-center space-x-3">
//           <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
//             <ArrowLeft className="text-white" />
//           </Button>
//           <h2 className="text-white font-semibold text-xl">Chat #{conversationId}</h2>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`max-w-sm p-3 rounded-xl ${
//               msg.isOwn ? 'ml-auto bg-purple-600 text-white' : 'bg-white/10 text-white'
//             }`}
//           >
//             <p>{msg.content}</p>
//             <span className="block text-xs mt-1 text-right opacity-60">{msg.time}</span>
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>

//       <div className="p-4 border-t border-white/10 flex gap-2">
//         <Input
//           placeholder="Type a message..."
//           className="bg-white/10 border-white/20 text-white"
//           value={newMsg}
//           onChange={(e) => setNewMsg(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//         />
//         <Button onClick={handleSend}>
//           <Send className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/hooks/useWebSocket';

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token') || '';

  const { sendMessage } = useWebSocket(token, (data: any) => {
    if (data.message === 'Welcome from WebSocket server') return;

    if (data.unreadMsgs) {
      const formatted = data.unreadMsgs.map((m: any) => ({
        ...m,
        isOwn: m.senderid === user.id,
        time: 'Unread', // Should come from server ideally
      }));
      setMessages((prev) => [...prev, ...formatted]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          isOwn: data.senderid === user.id,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  });

  const handleSend = () => {
    if (!newMsg.trim()) return;

    const message = {
      senderid: user.id,
      receiverid: Number(conversationId),
      content: newMsg,
    };

    console.log('📤 Sending message:', message);
    sendMessage(message);

    setMessages((prev) => [
      ...prev,
      {
        ...message,
        isOwn: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setNewMsg('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="text-white" />
          </Button>
          <h2 className="text-white font-semibold text-xl">Chat #{conversationId}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-sm p-3 rounded-xl ${
              msg.isOwn ? 'ml-auto bg-purple-600 text-white' : 'bg-white/10 text-white'
            }`}
          >
            <p>{msg.content}</p>
            <span className="block text-xs mt-1 text-right opacity-60">{msg.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-white/10 flex gap-2">
        <Input
          placeholder="Type a message..."
          className="bg-white/10 border-white/20 text-white"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
