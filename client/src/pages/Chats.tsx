import MessageInput from "../components/MessageInput";
import MessageItem from "../components/MessageItem";
import ChatHeader from "../components/ChatHeader";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Msg {
    content: string;
    senderid: number;
    recieverid: number;
    id: number;  // Assuming each message has a unique ID
}

const Chats = () => {
    const { userId } = useParams<{ userId: string }>();
    const [messages, setMessages] = useState<Msg[]>([]);
    const [recipientName, setRecipientName] = useState<string>("");
    const websocket = useRef<WebSocket | null>(null);

    // Fetch chat history
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await axios.get(`http://localhost:300/api/v1/user/chat-history`,{
                    headers:{ Authorization: `Bearer ${token}`}
                });
                setMessages(res.data);
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        };
        fetchChats();
    }, []);

    // Fetch recipient name
    useEffect(() => {
        const fetchRecipientName = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/user/getDetails`);
                setRecipientName(res.data.name);
            } catch (error) {
                console.error("Error fetching recipient name:", error);
            }
        };
        fetchRecipientName();
    }, [userId]);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Fetch JWT token from storage
        const encodedToken = encodeURIComponent(token || ""); // Encode token
    
        websocket.current = new WebSocket(`ws://localhost:8080?token=${encodedToken}`);
    
        websocket.current.onopen = () => {
            console.log("WebSocket connection established.");
        };
    
        websocket.current.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };
    
        websocket.current.onclose = () => {
            console.log("WebSocket connection closed.");
        };
    
        websocket.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    
        return () => {
            websocket.current?.close(); // Clean up on component unmount
        };
    }, []);
    

    const [currentUser, setCurrentUser] = useState<{ id: number, name: string }>();

useEffect(() => {
    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token'); 
            const res = await axios.get("http://localhost:PORT/api/v1/auth/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCurrentUser(res.data);
        } catch (error) {
            console.error("Failed to fetch user info", error);
        }
    };
    fetchCurrentUser();
}, []);


    const wsSend = (content: string) => {
        const newMessage = {
            content,
            senderid: currentUser?.id || 0 , // replace with the actual sender ID
            recieverid: parseInt(userId!),  // parse recipient ID from params
            id: -1
        };
        websocket.current?.send(JSON.stringify(newMessage));
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return (
        <div className="bg-slate-950 min-h-screen">
            <ChatHeader name={recipientName} />
            <div className="messages-container">
                {messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        message={message.content}
                        isSender={message.senderid === currentUser?.id}  // replace with actual user ID
                    />
                ))}
            </div>
            <MessageInput onSend={wsSend} />
        </div>
    );
};

export default Chats;
