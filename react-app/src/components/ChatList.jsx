import Header from "./header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CONVERSATIONS_URL } from "../constants";
import '../App.css';

function ChatList() {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

        axios.post(CONVERSATIONS_URL, { userId: localStorage.getItem('userId') })
            .then((res) => {
                setConversations(res.data.conversations || []);
            })
            .catch(() => {
                alert('server error');
            });
    }, [navigate]);

    return (
        <div className="product-page">
            <Header />
            <div className="form-card">
                <h1>Chats</h1>
                <p className="form-subtitle">Your buyer and seller conversations.</p>
                {conversations.length > 0 ? conversations.map((conversation) => (
                    <button
                        type="button"
                        className="chat-row"
                        key={conversation.otherUserId}
                        onClick={() => navigate(`/chat/${conversation.otherUserId}`)}
                    >
                        <strong>{conversation.user?.username || 'User'}</strong>
                        <span>{conversation.lastMessage?.text}</span>
                    </button>
                )) : <p className="no-products">No conversations yet</p>}
            </div>
        </div>
    );
}

export default ChatList;
