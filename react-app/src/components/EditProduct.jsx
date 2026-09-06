import Header from "./header";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../App.css';
import { BASE_URL, PRODUCT_URL } from "../constants";

function EditProduct() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [price, setPrice] = useState('');
    const [pdesc, setPdesc] = useState('');
    const [pimage, setPimage] = useState('');
    const [pimage2, setPimage2] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

        axios.get(`${PRODUCT_URL}/${id}`)
            .then((res) => {
                const result = res.data.product;
                setProduct(result);
                setPrice(result.price);
                setPdesc(result.pdesc);
            })
            .catch(() => {
                alert('server error');
            });
    }, [id, navigate]);

    const handleApi = () => {
        const formData = new FormData();
        formData.append('price', price);
        formData.append('pdesc', pdesc);
        formData.append('userId', localStorage.getItem('userId'));
        if (pimage) {
            formData.append('pimage', pimage);
        }
        if (pimage2) {
            formData.append('pimage2', pimage2);
        }

        axios.put(`${PRODUCT_URL}/${id}`, formData)
            .then((res) => {
                if (res.data.message) {
                    alert(res.data.message);
                    navigate('/my-products');
                }
            })
            .catch(() => {
                alert('server error');
            });
    };

    if (!product) {
        return <div className="product-page"><Header /><p className="detail-status">Loading product...</p></div>;
    }

    return (
        <div className="product-page">
            <Header />
            <div className="form-card">
                <h1>Edit product</h1>
                <p className="form-subtitle">Update the details of your listing.</p>
                <p className="detail-category">{product.category}</p>
                <h2>{product.pname}</h2>
                <label className="form-field">
                    Price
                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                </label>
                <label className="form-field">
                    Description
                    <input type="text" value={pdesc} onChange={(e) => setPdesc(e.target.value)} />
                </label>
                <label className="form-field">
                    Current image
                    <img className="edit-image-preview" src={`${BASE_URL}/${product.pimage}`} alt={product.pname} />
                    Replace image
                    <input type="file" onChange={(e) => setPimage(e.target.files[0])} />
                </label>
                <label className="form-field">
                    Replace second image
                    <input type="file" onChange={(e) => setPimage2(e.target.files[0])} />
                </label>
                <button onClick={handleApi} className="form-submit">Save changes</button>
            </div>
        </div>
    );
}

export default EditProduct;
