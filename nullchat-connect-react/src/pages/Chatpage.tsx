// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Send } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { useWebSocket } from '@/hooks/useWebSocket';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import { formatMessageBubbleTime } from '@/utils/timeFormatter';
// import { useLocation } from 'react-router-dom';




// type DecodedToken = {
//   id: number;
//   // optionally: username, email, etc.
// };

// const ChatPage = () => {
//   const { conversationId } = useParams();
//   const navigate = useNavigate();
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   const [newMsg, setNewMsg] = useState('');
//   const [messages, setMessages] = useState<any[]>([]);

//   const token = localStorage.getItem('token');
//   const user: DecodedToken | null = token ? jwtDecode(token) : null;

//   const location = useLocation();
//   const { username, phoneNumber } = location.state || {}

//   if (!user?.id) {
//     console.error('❌ No valid user ID found in token.');
//     return <div className="text-red-500 p-4">Error: User not logged in properly.</div>;
//   }

//   // ✅ Fetch chat history
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

//         console.log('📦 Raw history from backend:', res.data);

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
//         console.error('❌ Failed to fetch history:', err);
//       }
//     };

//     fetchHistory();
//   }, [conversationId, token, user.id]);

//   // ✅ WebSocket Logic
//   const { sendMessage } = useWebSocket(token!, (data: any) => {
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
//           {/* <h2 className="text-white font-semibold text-xl">Chat #{conversationId}</h2> */}
//                 <div className="flex items-center space-x-3">
//           <div className="relative">
//             <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
//               {username
//                 ? username
//                     .split(' ')
//                     .map((n) => n[0])
//                     .join('')
//                     .slice(0, 2)
//                     .toUpperCase()
//                 : phoneNumber?.slice(-2)}
//             </div>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-white font-semibold text-base">
//               {username || phoneNumber || `Chat #${conversationId}`}
//             </span>
//               </div>
//             </div>
//             </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.length > 0 ? (
//           messages.map((msg, idx) => (
//             <div key={idx} className={`w-full flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
//               <div
//                 className={`max-w-sm p-3 rounded-xl ${
//                   msg.isOwn ? 'bg-purple-600 text-white' : 'bg-white/10 text-white'
//                 }`}
//               >
//                 <p>{msg.content}</p>
//                 <span className="block text-xs mt-1 text-right opacity-60">{formatMessageBubbleTime(msg.timestamp)}</span>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-purple-400 italic text-center mt-10">No messages yet.</div>
//         )}
//         <div ref={bottomRef} />
//       </div>
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

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/hooks/useWebSocket';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { formatMessageBubbleTime } from '@/utils/timeFormatter';

type DecodedToken = {
  id: number;
};

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const token = localStorage.getItem('token');
  const user: DecodedToken | null = token ? jwtDecode(token) : null;

  const location = useLocation();
  const { username, phoneNumber } = location.state || {};

  if (!user?.id) {
    return <div className="text-red-500 p-4">Error: User not logged in properly.</div>;
  }

  // Fetch history
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

        const history = res.data.map((msg: any) => ({
          ...msg,
          isOwn: Number(msg.senderid) === Number(user.id),
        }));

        setMessages(history);
      } catch (err) {
        console.error('❌ Failed to fetch history:', err);
      }
    };

    fetchHistory();
  }, [conversationId, token, user.id]);

  // WebSocket
  const { sendMessage } = useWebSocket(token!, (data: any) => {
    if (data.message === 'Welcome from WebSocket server') return;

    if (data.unreadMsgs) {
      const formatted = data.unreadMsgs.map((m: any) => ({
        ...m,
        isOwn: Number(m.senderid) === Number(user.id),
      }));
      setMessages((prev) => [...prev, ...formatted]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          isOwn: Number(data.senderid) === Number(user.id),
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

    sendMessage(message);
    setMessages((prev) => [...prev, { ...message, isOwn: true }]);
    setNewMsg('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-white/10 bg-black/20 backdrop-blur">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="text-white" />
        </Button>
        <div className="ml-4 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold">
            {username
              ? username
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : phoneNumber?.slice(-2)}
          </div>
          <span className="text-lg font-semibold">
            {username || phoneNumber || `Chat #${conversationId}`}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div key={idx} className={`w-full flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-sm lg:max-w-md p-3 rounded-2xl text-sm ${
                  msg.isOwn
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white border border-white/10'
                }`}
              >
                <p>{msg.content}</p>
                <span className="block text-xs mt-1 text-right opacity-60">
                  {formatMessageBubbleTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-purple-300 italic text-center mt-10">No messages yet.</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black/30 backdrop-blur-sm flex gap-2">
        <Input
          placeholder="Type a message..."
          className="bg-white/10 border-white/20 text-white focus:ring-1 focus:ring-purple-500"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} variant="default">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
