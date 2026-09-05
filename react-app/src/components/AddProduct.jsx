import Header from "./header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../App.css';
import categories from "./CategoriesList";
import { locations } from "./header";
import { ADD_PRODUCT_URL } from "../constants";

function AddProduct() {
    const navigate = useNavigate();
    const [position] = useState({ latitude: null, longitude: null });
    const [pname, setPname] = useState('');
    const [price, setPrice] = useState('');
    const [pdesc, setPdesc] = useState('');
    const [category, setCategory] = useState('');
    const [pimage, setPimage] = useState('');
    const [pimage2, setPimage2] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    const handleApi = () => {
        const formData = new FormData();
        formData.append('pLat', position.latitude || '');
        formData.append('pLong', position.longitude || '');
        formData.append('pname', pname);
        formData.append('price', price);
        formData.append('pdesc', pdesc);
        formData.append('category', category);
        formData.append('pimage', pimage);
        formData.append('userId', localStorage.getItem('userId'));
        formData.append('pimage2', pimage2);
        formData.append('location', location);

        axios.post(ADD_PRODUCT_URL, formData)
            .then((res) => {
                if (res.data.message) {
                    alert(res.data.message);
                    navigate('/');
                }
            })
            .catch(() => {
                alert('server error');
            });
    };

    return (
        <div className="product-page">
            <Header />
            <div className="form-card">
                <h1>Sell an item</h1>
                <p className="form-subtitle">Add the details buyers need to know.</p>
                <label className="form-field">
                    Product name
                    <input type="text" value={pname} onChange={(e) => setPname(e.target.value)} />
                </label>
                <label className="form-field">
                    Price
                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                </label>
                <label className="form-field">
                    Description
                    <input type="text" value={pdesc} onChange={(e) => setPdesc(e.target.value)} />
                </label>
                <label className="form-field">
                    Category
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option>BIKES</option>
                        <option>MOBILES</option>
                        <option>CLOTHING</option>
                        {
                            categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))
                        }
                    </select>
                </label>
                <label className="form-field">
                    Location
                    <select value={location} onChange={(e) => setLocation(e.target.value)}>
                        <option value="">Select location</option>
                        {locations.map((item, index) => (
                            <option key={index} value={item.placeName}>{item.placeName}</option>
                        ))}
                    </select>
                </label>
                <label className="form-field">
                    Product image
                    <input type="file" onChange={(e) => setPimage(e.target.files[0])} />
                </label>
                 
                <label className="form-field">
                    Product image
                    <input type="file" onChange={(e) => setPimage2(e.target.files[0])} />
                </label>
                <button onClick={handleApi} className="form-submit">Publish listing</button>
            </div>
        </div>
    );
}

export default AddProduct;
