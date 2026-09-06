import Header from "./header";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { BASE_URL, CONVERSATION_URL } from "../constants";
import '../App.css';

function Chat() {
    const navigate = useNavigate();
    const { otherUserId } = useParams();
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

        axios.post(CONVERSATION_URL, { userId, otherUserId })
            .then((res) => setMessages(res.data.messages || []))
            .catch(() => alert('server error'));

        const socket = io(BASE_URL);
        socketRef.current = socket;
        socket.emit('register', userId);
        socket.on('connect', () => socket.emit('register', userId));
        socket.on('receiveMessage', (message) => {
            if (message.senderId === otherUserId) {
                setMessages((currentMessages) => [...currentMessages, message]);
            }
        });

        return () => socket.disconnect();
    }, [navigate, otherUserId, userId]);

    const handleSend = () => {
        if (!text.trim()) {
            return;
        }

        const data = {
            senderId: userId,
            receiverId: otherUserId,
            text: text.trim()
        };
        if (!data.senderId || !data.receiverId) {
            alert('Please login before sending a message.');
            return;
        }

        socketRef.current.emit('sendMessage', data);
        setMessages((currentMessages) => [...currentMessages, data]);
        setText('');
    };

    return (
        <div className="product-page">
            <Header />
            <div className="form-card chat-card">
                <button type="button" className="form-link chat-back" onClick={() => navigate('/chats')}>Back to chats</button>
                <h1>Chat</h1>
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <p className={message.senderId === userId ? 'chat-message mine' : 'chat-message'} key={message._id || index}>
                            {message.text}
                        </p>
                    ))}
                </div>
                <div className="chat-compose">
                    <input
                        type="text"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        placeholder="Write a message"
                    />
                    <button type="button" className="form-submit" onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default Chat;
