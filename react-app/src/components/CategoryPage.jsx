import Header from "./header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import './Home.css';
import { useParams } from "react-router-dom";
import { BASE_URL, LIKE_PRODUCT_URL, LIKED_PRODUCTS_URL, PRODUCTS_URL, SEARCH_URL } from "../constants";

function ProductCard({ item }) {
    const navigate = useNavigate();
    const [isWishlisted, setIsWishlisted] = useState(item.isLiked || false);
    console.log('[Category ProductCard] heart state', { productId: item._id, isWishlisted, itemIsLiked: item.isLiked });

    const openProduct = () => {
        console.log('ProductCard _id:', item._id);
        console.log('Product detail URL:', `/product/${item._id}`);
        navigate(`/product/${item._id}`);
    };

    const handlelike = (productId) =>{
        const userId = localStorage.getItem('userId');
        const data ={ userId, productId};
        axios.post(LIKE_PRODUCT_URL, data)
            .then((res) => {
                setIsWishlisted(res.data.liked);
            })
            .catch(() => {
                alert('server error');
            });
    }

    return (
        <div className="product-card" onClick={openProduct} role="link" tabIndex="0">
            <button
                type="button"
                className={`icon-con wishlist-button ${isWishlisted ? 'is-wishlisted' : ''}`}
                onClick={(event) => {
                    event.stopPropagation();
                    setIsWishlisted((current) => !current);
                    handlelike(item._id);
                }}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                {isWishlisted ? <FaHeart /> : <FaRegHeart />}
            </button>
            <img className="product-image" src={`${BASE_URL}/${item.pimage}`} alt={item.pname} />
            <div className="product-info">
                <p className="product-name">{item.pname} <span>{item.category}</span></p>
                <h3 className="product-price">{item.price}</h3>
                <p className="product-desc">{item.pdesc}</p>
            </div>
        </div>
    );
}

function  CategoryPage() {
    const navigate = useNavigate();

const param = useParams();



    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All categories');
    const [cproducts, setCProducts] = useState([]);
    const [issearch ,setsearch] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

    Promise.all([
        axios.get(PRODUCTS_URL + '?catName=' + param.catName),
        axios.post(LIKED_PRODUCTS_URL, { userId: localStorage.getItem('userId') })
    ])
          .then(([productsRes, likedRes]) => {
                const likedIds = (likedRes.data.products || []).map((item) => item._id);
                const result = (productsRes.data.products || [])
                    .filter((item) => (item.category || '').trim().toLowerCase() === (param.catName || '').trim().toLowerCase())
                    .map((item) => ({ ...item, isLiked: likedIds.includes(item._id) }));
                setProducts(result);
                setFilteredProducts(result);
            })
            .catch(() => {
                alert('server error');
            });

    }, [param.catName, navigate]);

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
       // filterProducts(search, category);
const url = SEARCH_URL + '?search=' + search;
 axios.get(url)
            .then((res) => {
                setProducts(res.data.products || []);
                setsearch(true);
            })
            .catch(() => {
                alert('server error');
            });
    };

    const handleCategory = (value) => {
        setCategory(value);
        filterProducts(search, value);
    };

    return (
     <>  {!issearch &&  <div className="home-shell">
            <Header search={search} handlesearch={handleSearch} handleclick={handleClick} />
            <Categories handlecategory={handleCategory} />
            {issearch && cproducts && <h5>SEARCH RESULTS</h5>}
            {issearch && cproducts && cproducts.length === 0 && <h5>NO RESULTS FOUND</h5>}
            <div className="results-wrapper">
                <h5 className="results-title">SEARCH RESULTS</h5>
                <button onClick={() => {
                    setSearch('');
                    setCategory('All categories');
                    setFilteredProducts(products);
                    setCProducts([]);
                    setsearch(false);
                }}>Clear</button>
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
        </div>}
        </>
    );
}

export default CategoryPage;
