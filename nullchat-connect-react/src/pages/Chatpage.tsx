// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Send } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { useWebSocket } from '@/hooks/useWebSocket';
// import axios from 'axios';

// const ChatPage = () => {
//   const { conversationId } = useParams();
//   const navigate = useNavigate();

//   const [newMsg, setNewMsg] = useState('');
//   const [messages, setMessages] = useState<any[]>([]);
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   const user = JSON.parse(localStorage.getItem('user') || '{}');
//   const token = localStorage.getItem('token') || '';

//   // ✅ Fetch Message History
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await axios.get(
//           `https://chat-app-e527.onrender.com/api/v1/chathistory/${conversationId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             withCredentials: true,
//           }
//         );

//         const history = res.data.map((msg: any) => ({
//           ...msg,
//           isOwn: Number(msg.senderid) === Number(user.id),
//           time: new Date(msg.timestamp).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           }),
//         }));

//         setMessages(history);
//       } catch (err) {
//         console.error('Failed to fetch history:', err);
//       }
//     };

//     fetchHistory();
//   }, [conversationId]);

//   // ✅ WebSocket Logic
//   const { sendMessage } = useWebSocket(token, (data: any) => {
//     if (data.message === 'Welcome from WebSocket server') return;

//     if (data.unreadMsgs) {
//       const formatted = data.unreadMsgs.map((m: any) => ({
//         ...m,
//         isOwn: Number(m.senderid) === Number(user.id),
//         time: new Date(m.timestamp).toLocaleTimeString([], {
//           hour: '2-digit',
//           minute: '2-digit',
//         }),
//       }));
//       setMessages((prev) => [...prev, ...formatted]);
//     } else {
//       setMessages((prev) => [
//         ...prev,
//         {
//           ...data,
//           isOwn: Number(data.senderid) === Number(user.id),
//           time: new Date().toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           }),
//         },
//       ]);
//     }
//   });

//   const handleSend = () => {
//     if (!newMsg.trim()) return;

//     const message = {
//       senderid: user.id,
//       receiverid: Number(conversationId),
//       content: newMsg,
//     };

//     sendMessage(message);

//     setMessages((prev) => [
//       ...prev,
//       {
//         ...message,
//         isOwn: true,
//         time: new Date().toLocaleTimeString([], {
//           hour: '2-digit',
//           minute: '2-digit',
//         }),
//       },
//     ]);

//     setNewMsg('');
//   };

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   return (
//     <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
//         <div className="flex items-center space-x-3">
//           <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
//             <ArrowLeft className="text-white" />
//           </Button>
//           <h2 className="text-white font-semibold text-xl">Chat #{conversationId}</h2>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.length > 0 ? (
//           messages.map((msg, idx) => (
//             <div key={idx} className={`w-full flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
//               <div
//                 className={`max-w-sm p-3 rounded-xl ${
//                   msg.isOwn
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-white/10 text-white'
//                 }`}
//               >
//                 <p>{msg.content}</p>
//                 <span className="block text-xs mt-1 text-right opacity-60">{msg.time}</span>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-purple-400 italic text-center mt-10">No messages yet.</div>
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {/* Input */}
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
import axios from 'axios';

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem('token') || '';

  if (!user || !user.id) {
    console.error("❌ Invalid user in localStorage:", storedUser);
  }

  console.log("🔐 User ID:", user?.id);

  // ✅ Fetch Message History
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `https://chat-app-e527.onrender.com/api/v1/chathistory/${conversationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        console.log("📦 Raw history from backend:", res.data);

        const history = res.data.map((msg: any) => {
          const isOwn = Number(msg.senderid) === Number(user.id);
          console.log("💬 MSG FROM:", msg.senderid, "| YOU:", user.id, "| isOwn:", isOwn);

          return {
            ...msg,
            isOwn,
            time: new Date(msg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        });

        setMessages(history);
      } catch (err) {
        console.error('❌ Failed to fetch history:', err);
      }
    };

    fetchHistory();
  }, [conversationId]);

  // ✅ WebSocket Logic
  const { sendMessage } = useWebSocket(token, (data: any) => {
    console.log("📡 WS Message Received:", data);

    if (data.message === 'Welcome from WebSocket server') return;

    if (data.unreadMsgs) {
      const formatted = data.unreadMsgs.map((m: any) => {
        const isOwn = Number(m.senderid) === Number(user.id);
        console.log("🟡 Unread From:", m.senderid, "| You:", user.id, "| isOwn:", isOwn);

        return {
          ...m,
          isOwn,
          time: new Date(m.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      });

      setMessages((prev) => [...prev, ...formatted]);
    } else {
      const isOwn = Number(data.senderid) === Number(user.id);
      console.log("🟢 Realtime From:", data.senderid, "| You:", user.id, "| isOwn:", isOwn);

      setMessages((prev) => [
        ...prev,
        {
          ...data,
          isOwn,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    }
  });

  // ✅ Send Message
  const handleSend = () => {
    if (!newMsg.trim()) return;

    const message = {
      senderid: user.id,
      receiverid: Number(conversationId),
      content: newMsg,
    };

    console.log("📤 Sending message:", message);

    sendMessage(message);

    setMessages((prev) => [
      ...prev,
      {
        ...message,
        isOwn: true,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);

    setNewMsg('');
  };

  // ✅ Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="text-white" />
          </Button>
          <h2 className="text-white font-semibold text-xl">Chat #{conversationId}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div key={idx} className={`w-full flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-sm p-3 rounded-xl ${
                  msg.isOwn ? 'bg-purple-600 text-white' : 'bg-white/10 text-white'
                }`}
              >
                <p>{msg.content}</p>
                <span className="block text-xs mt-1 text-right opacity-60">{msg.time}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-purple-400 italic text-center mt-10">No messages yet.</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
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
