import React, { useEffect, useState } from 'react';

const Test = () => {
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState('');
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkFsb2siLCJwaG9uZU51bWJlciI6Ijg3MDA2MjkwMTIiLCJwYXNzd29yZCI6IiQyYiQxMCRrWEQ1c0VuNEpoemdRWDBwd1dWUGRlTlZva1NST3RFVG5zakw3d0tzVU83dGVRVUhKSS5TbSIsImlhdCI6MTcyODgwNTI0MH0.n9QWy2iMMWSUSW5fulAcdaRzhSJo3eY9nDvXJQBkgco"

    useEffect(() => {
        console.log("hello");
        
        const socket = new WebSocket(`ws://localhost:8080?token=${token}`);

        socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        socket.onmessage = (message) => {
            console.log('Message from server:', message.data);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = (event) => {
            console.log('WebSocket connection closed',event.code,event.reason);
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, [token]);

    const sendMessage = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ message }));
            setMessage('');
        } else {
            console.error('WebSocket not open. Current state:', ws?.readyState);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
            />
            <button onClick={sendMessage}>Send Message</button>
        </div>
    );
};

export default Test;
