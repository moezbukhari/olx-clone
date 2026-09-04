import Header from "./header";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../App.css';

function Signup() {
const navigate = useNavigate();

const [ username,setusername] = useState('');
const [ password,setpassword] = useState('');
const [ contact,setcontact] = useState('');
const [ gmail,setgmail] = useState('');
 

const handleApi = () => {
    const url = 'http://localhost:4000/signup';
    const data = { username, password, contact, gmail };
    axios.post(url, data)
        .then((res) => {
            if (res.data.message) {
                alert(res.data.message);
                navigate('/login');
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
                <h1>Create your account</h1>
                <p className="form-subtitle">Join the marketplace and start listing.</p>
                <label className="form-field">
                    Username
                    <input type="text" value={username} onChange={(e) => setusername(e.target.value)} />
                </label>
                <label className="form-field">
                    Password
                    <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} />
                </label>
                <label className="form-field">
                    Contact No.
                    <input type="text" value={contact} onChange={(e) => setcontact(e.target.value)} />
                </label>
                <label className="form-field">
                    Gmail
                    <input type="email" value={gmail} onChange={(e) => setgmail(e.target.value)} />
                </label>
                <button className="form-submit" onClick={handleApi}>Sign up</button>
                <Link className="form-link" to="/login">Already have an account?</Link>
            </div>
        </div>
    );
}

export default Signup;