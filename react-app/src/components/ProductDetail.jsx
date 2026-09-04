import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./header";
import '../App.css';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const url = `http://localhost:4000/product/${id}`;
        axios.get(url)
            .then((res) => {
                setProduct(res.data.product);
            })
            .catch(() => {
                alert('server error');
            });
    }, [id]);
    const handleContact = (addedBy) => {

const url = `http://localhost:4000/get-user/${addedBy}`;
        axios.get(url)
            .then((res) => {
                if(res.data.user) {
                    setUser(res.data.user);
                }
            })
            .catch(() => {
                alert('server error');
            });

    }

    return (
        <div className="product-page">
            <Header />
            <main className="detail-card">
                {!product && <p className="detail-status">Loading product...</p>}
                {product && (
                    <>
                        <img className="detail-image" src={`http://localhost:4000/${product.pimage}`} alt={product.pname} />
                        <div className="detail-content">
                            <p className="detail-category">{product.category}</p>
                            <h1>{product.pname}</h1>
                            <p className="detail-price">{product.price}</p>
                            <p className="detail-description">{product.pdesc}</p>
                            <p className="detail-seller">Posted by seller</p>
                            <Link className="form-link" to="/">Back to products</Link>
                            { product.addedBy && (
                                <button onClick={() => handleContact(product.addedBy)}>SHOW CONTACT DETAILS </button>
                            ) }
                            { user && user.username && <h4>{user.username}</h4> }
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default ProductDetail;
