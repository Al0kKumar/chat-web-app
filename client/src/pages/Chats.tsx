import MessageInput from "../components/MessageInput";
import MessageItem from "../components/MessageItem";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ChatHeader from "../components/ChatHeader";

interface Msg {
    id: number
    content: string;
    senderid: number;
    receiverid: number;
    timestamp: string
}

const Chats = () => {
    const { userId } = useParams<{ userId: string }>();
    const [messages, setMessages] = useState<Msg[]>([]);
    const [recipientName, setRecipientName] = useState<string>("");
    const [currentUser, setCurrentUser] = useState<{ id: number; name: string } | null>(null);
    const websocket = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref to scroll to the bottom
     
    console.log('userId from params :',userId)

    // Fetch chat history based on recipient ID
    useEffect(() => {
        const fetchChats = async () => {
            if(!userId)   return ;
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`http://localhost:3000/api/v1/chathistory`, {
                    params: { recipientId: userId }, // Pass recipient ID
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessages(res.data);
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        };
        fetchChats(); // Only fetch if `userId` exists
    }, [userId]);

    // Fetch recipient's name
    useEffect(() => {
        const fetchRecipientName = async () => {
            if(!userId)    return ;
            try {
                const token = localStorage.getItem('token')
                const res = await axios.get(`http://localhost:3000/api/v1/recipentdetails`, {
                    params: { userId },
                    headers:{Authorization: `Bearer ${token}`}
                });
                
                setRecipientName(res.data.name);
            } catch (error) {
                console.error("Error fetching recipient name:", error);
            }
        };
        fetchRecipientName();
    }, [userId]);

    // Fetch current user info
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:3000/api/v1/userDetails", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('data fetched from api',res.data);
                console.log('username is',res.data.name);
                
                setCurrentUser(res.data);
            } catch (error) {
                console.error("Failed to fetch user info", error);
            }
        };
        fetchCurrentUser();
    }, []);

    // Set up WebSocket connection
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.log('token not found. cannot establish web socket connection');
            return;
        }

        const encodedToken = encodeURIComponent(token || "");
        websocket.current = new WebSocket(`ws://localhost:8080?token=${encodedToken}`);

        websocket.current.onopen = () => {
            console.log("WebSocket connection established.");
        };

        websocket.current.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            // Add the new message to the message list
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        websocket.current.onclose = (event) => {
            console.log("WebSocket connection closed.", event);
        };

        websocket.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            websocket.current?.close(); // Clean up on component unmount
        };
    }, []);

    // Function to send messages via WebSocket
    const wsSend = (content: string) => {
        
        if(!currentUser || !userId){
            console.log('currentuser or userId is missing ');
            return ;
            
        }

        const newMessage: Msg = {
            id: Date.now(),
            content,
            senderid: currentUser.id,
            receiverid: parseInt(userId), // Parse recipient ID from URL params
            timestamp: new Date().toISOString()      
        };

        console.log('sending message via web socket ', newMessage);
        

        // Send the new message via WebSocket
        websocket.current?.send(JSON.stringify(newMessage));
        // Optimistically add the new message to the UI
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    // Scroll to the bottom when messages update
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Render loading if user data is not yet loaded
    if (!currentUser) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <div className="flex flex-col h-screen bg-blue-600">
            {/* Top Bar */}
            <ChatHeader name={recipientName} onBack={() => history.back()}/>

            <div className="flex-1  p-4 bg-slate-700 overflow-y-auto">
                <div className="flex flex-col space-y-2">
                    {messages.map((message) => (
                        <MessageItem
                            key={message.id}
                            message={message.content}
                            isSender={message.senderid === currentUser.id}
                            timestamp={message.timestamp}
                        />
                    ))}
                    <div ref={messagesEndRef} /> {/* To scroll to the bottom */}
                </div>
            </div>
            <MessageInput onSend={wsSend} />
        </div>
    );
};

export default Chats;
