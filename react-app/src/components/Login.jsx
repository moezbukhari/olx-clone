import Header from "./header";
import { useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import '../App.css';
import { LOGIN_URL } from "../constants";

function Login() {
    const navigate=useNavigate();

const [ username,setusername] = useState('');
const [ password,setpassword] = useState('');

const handleApi = () => {
    const data = { username, password };
    axios.post(LOGIN_URL, data)
        .then((res) => {
            if (res.data.message) {
                alert(res.data.message);
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('userId', res.data.userId);
                    navigate('/');
                }
            }
        })
        .catch(() => {
            alert('server error');
        });
};


    return (
        <div className="auth-page">
            <Header />
            <div className="form-card">
                <h1>Welcome back</h1>
                <p className="form-subtitle">Sign in to continue browsing listings.</p>
                <label className="form-field">
                    Username
                    <input type="text" value={username} onChange={(e) => setusername(e.target.value)} />
                </label>
                <label className="form-field">
                    Password
                    <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} />
                </label>
                <button className="form-submit" onClick={handleApi}>Login</button>
                <Link className="form-link" to="/signup">Create an account</Link>
            </div>
        </div>
    );
}

export default Login;