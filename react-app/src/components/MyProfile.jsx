import Header from "./header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function MyProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:4000/get-user/${localStorage.getItem('userId')}`)
            .then((res) => {
                setUser(res.data.user || {});
            })
            .catch(() => {
                alert('server error');
            });
    }, [navigate]);

    return (
        <div className="home-shell">
            <Header />
            <div className="results-wrapper">
                <h5 className="results-title">MY PROFILE</h5>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th>Username</th>
                            <td>{user.username}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{user.gmail}</td>
                        </tr>
                        <tr>
                            <th>Contact No.</th>
                            <td>{user.contact}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyProfile;
