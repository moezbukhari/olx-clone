import Header from "./header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import './Home.css';
import { BASE_URL, LIKED_PRODUCTS_URL } from "../constants";

function ProductCard({ item }) {
    const navigate = useNavigate();

    const openProduct = () => {
        navigate(`/product/${item._id}`);
    };

    return (
        <div className="product-card" onClick={openProduct} role="link" tabIndex="0">
            <img className="product-image" src={`${BASE_URL}/${item.pimage}`} alt={item.pname} />
            <div className="product-info">
                <p className="product-name">{item.pname} <span>{item.category}</span></p>
                <h3 className="product-price">{item.price}</h3>
                <p className="product-desc">{item.pdesc}</p>
            </div>
        </div>
    );
}

function LikedProducts() {
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
        axios.post(LIKED_PRODUCTS_URL, data)
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

    return (
        <div className="home-shell">
            <Header search={search} handlesearch={handleSearch} handleclick={handleClick} />
            <Categories handlecategory={handleCategory} />
            <div className="results-wrapper">
                <h5 className="results-title">SEARCH RESULTS</h5>
                <div className="product-grid">
                    {filteredProducts && filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => (
                            <ProductCard key={item._id} item={item} />
                        ))
                    ) : (
                        <p className="no-products">No product found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LikedProducts;
