import Header from "./header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import './Home.css';
import { BASE_URL, MY_PRODUCTS_URL, PRODUCT_URL } from "../constants";

function ProductCard({ item, onDelete }) {
    const navigate = useNavigate();

    const openProduct = () => {
        navigate(`/product/${item._id}`);
    };

    return (
        <div className="product-card" onClick={openProduct} role="link" tabIndex="0">
            <img loading="lazy" className="product-image" src={item.pimage.startsWith('http') ? item.pimage : `${BASE_URL}/${item.pimage}`} alt={item.pname} />
            <div className="product-info">
                <p className="product-name">{item.pname} <span>{item.category}</span></p>
                <h3 className="product-price">{item.price}</h3>
                <p className="product-desc">{item.pdesc}</p>
                <div className="product-actions">
                    <button type="button" onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/edit-product/${item._id}`);
                    }}>Edit</button>
                    <button type="button" onClick={(event) => {
                        event.stopPropagation();
                        onDelete(item._id);
                    }}>Delete</button>
                </div>
            </div>
        </div>
    );
}

function MyProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All categories');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

        const data = { userId: localStorage.getItem('userId') };
        axios.post(MY_PRODUCTS_URL, data)
            .then((res) => {
                const result = res.data.products || [];
                setProducts(result);
                setFilteredProducts(result);
            })
            .catch(() => {
                alert('server error');
            });
    }, [navigate]);

    const filterProducts = (searchValue, selectedCategory) => {
        const q = (searchValue || '').toLowerCase();
        const selected = selectedCategory || 'All categories';
        const result = products.filter((item) => {
            const itemName = (item.pname || '').toLowerCase();
            const itemDesc = (item.pdesc || '').toLowerCase();
            const itemCategory = (item.category || '').toLowerCase();
            const categoryMatch = selected === 'All categories' || itemCategory === selected.toLowerCase();
            const searchMatch = !q || itemName.includes(q) || itemDesc.includes(q) || itemCategory.includes(q);
            return categoryMatch && searchMatch;
        });
        setFilteredProducts(result);
    };

    const handleSearch = (value) => {
        setSearch(value);
        filterProducts(value, category);
    };

    const handleClick = () => {
        filterProducts(search, category);
    };

    const handleCategory = (value) => {
        setCategory(value);
        filterProducts(search, value);
    };

    const handleDelete = (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        axios.delete(`${PRODUCT_URL}/${productId}`, {
            data: { userId: localStorage.getItem('userId') }
        })
            .then((res) => {
                if (res.data.message) {
                    alert(res.data.message);
                    setProducts((currentProducts) => currentProducts.filter((item) => item._id !== productId));
                    setFilteredProducts((currentProducts) => currentProducts.filter((item) => item._id !== productId));
                }
            })
            .catch(() => {
                alert('server error');
            });
    };

    return (
        <div className="home-shell">
            <Header search={search} handlesearch={handleSearch} handleclick={handleClick} />
            <Categories handlecategory={handleCategory} />
            <div className="results-wrapper">
                <h5 className="results-title">MY ADD</h5>
                <div className="product-grid">
                    {filteredProducts && filteredProducts.length > 0 ? (
                            filteredProducts.map((item) => (
                            <ProductCard key={item._id} item={item} onDelete={handleDelete} />
                        ))
                    ) : (
                        <p className="no-products">No product found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyProducts;
