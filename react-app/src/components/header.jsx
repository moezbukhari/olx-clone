// ==========================================================
// header.jsx — ZERO LEVEL / BEGINNER EXPLANATION (Roman Urdu)
// Ye original code hai, sirf har line ke saamne comment likha
// gaya hai taake beginner ko samajh aaye ye line kya kar rahi hai
// ==========================================================

import './header.css';
// header.css file import kar rahe hain taake is component ke
// andar likhi gayi classNames (jaise "header-container",
// "search", "header-btn") ko CSS styling mil sake.

import { Link, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
// react-router-dom library se do cheezein import kar rahe hain:
// Link        → normal <a> tag ki tarah hai lekin page reload
//               kiye baghair ek page se doosre page par le
//               jata hai (SPA navigation).
// useNavigate → ek function deta hai jisse hum JS code ke andar
//               se (jaise button click par) kisi page par
//               programmatically bhej sakte hain.

export const locations=[
    {
        "Latitude": 28.6139,
        "Longitude": 77.2090,
        "placeName": "New Delhi, India"
    },
    {
        "Latitude": 19.0760,
        "Longitude": 72.8777,
        "placeName": "Mumbai, India"
    },
]

function Header(props) {
    // "function Header(props)" ek React component define kar
    // raha hai jo "props" (parent se aane wala data/functions)
    // accept karta hai. Ye component Home.jsx mein
    // <Header search={...} handlesearch={...} handleclick={...} />
    // ke through use hota hai, is liye "props" mein ye teeno
    // cheezein maujood hongi.

    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const closeMenu = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, []);

    const handleLocationChange = (e) => {
        if (props.handleLocationChange) {
            props.handleLocationChange(e.target.value);
        }
    };

    // useNavigate() call kar ke "navigate" naam ka function bana
    // liya. Isay hum "navigate('/login')" jaisa likh kar kisi
    // bhi route par bhej sakte hain.

    const handleLogout = () => {
        // Ye function tab chalega jab user "LOGOUT" button dabaye.

        localStorage.removeItem('token');
        // Browser ke localStorage se "token" naam ki cheez hata
        // rahe hain — matlab ab user ka login-proof delete ho
        // gaya, is liye app usay "logged out" samjhega.

        navigate('/login');
        // Token delete karne ke baad user ko seedha login page
        // par bhej diya.
    };

    return (
        // Jo JSX yahan return ho raha hai, wahi component screen
        // par render hoga.

        <div className='header-container'>
            {/* Poora header ka bahar wala wrapper div. CSS class
                "header-container" isko flex layout / styling
                deti hai (logo, search, buttons side by side). */}

            <div className='brand-block'>
                {/* Left side ka block jisme app ka naam/logo hai */}

                <Link className='brand-link' to='/'>HOME</Link>

                <select value={props.location || ''} onChange={handleLocationChange}>

    <option value="">All locations</option>

    {locations.map((location, index) => (
        <option key={index} value={location.placeName}>
            {location.placeName}
        </option>
    ))}

                </select>
                {/* Ye ek clickable link hai jo "/" route (Home
                    page) par le jata hai. "to='/'" batata hai
                    kis route par jana hai. Isay "HOME" text ke
                    sath dikhaya ja raha hai — ye brand/logo ka
                    kaam bhi kar raha hai. */}
            </div>

            <div className='header'>
                {/* Middle section jisme search input aur search
                    button hai */}

                <FiSearch className='search-icon' />
                <input
                    className='search'
                    type='text'
                    value={props && props.search}
                    // Input ki current value "props.search" se
                    // aa rahi hai — matlab is input ka data Home
                    // component control karta hai (controlled
                    // input). "props &&" sirf ek safety check hai
                    // taake agar props hi na aayein to crash na ho.
                    onChange={(e) => props.handlesearch && props.handlesearch(e.target.value)}
                    // Jab bhi user kuch type kare, "onChange" fire
                    // hoga. "e.target.value" us waqt input box
                    // mein maujood poora text hai. Ye value
                    // "props.handlesearch" (jo Home.jsx ka
                    // handleSearch function hai) ko bhej rahe
                    // hain taake Home component apna "search"
                    // state update kar sake aur list filter ho.
                    // "props.handlesearch &&" ek safety check hai
                    // taake agar ye function na diya gaya ho to
                    // error na aaye.
                />
                <button className='search-btn' onClick={() => props.handleclick && props.handleclick()}>
                    {/* Search button. Click hone par
                        "props.handleclick" (Home.jsx ka
                        handleClick function) call hota hai jo
                        current search/category se dobara filter
                        chalata hai. */}
                    SEARCH
                </button>
            </div>

            <div className='header-actions' ref={menuRef}>
                {/* Right side ka block — login/logout/add-product
                    jaise buttons yahan hain */}

                <button
                    type="button"
                    className="avatar-button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Open user menu"
                >
                    U
                </button>

                {isMenuOpen && <div className="user-menu">
                    {!!localStorage.getItem('token') && (
                    // "!!" do baar "not" lagane se value ko boolean
                    // (true/false) mein badal deta hai.
                    // localStorage.getItem('token') agar koi value
                    // laaye (matlab token maujood hai / user login
                    // hai) to ye poora condition TRUE ho jayega aur
                    // neeche wala Link dikhega.
                        <Link className='header-btn' to='/add-product'>ADD PRODUCT</Link>
                    // Sirf login user ko "ADD PRODUCT" button
                    // dikhega jo /add-product page par le jayega.
                    )}
                    {localStorage.getItem('token') && (
                        <Link className='header-btn' to='/my-products'>MY ADD</Link>
                    )}
                    {localStorage.getItem('token') && (
                        <Link className='header-btn' to='/my-profile'>MY PROFILE</Link>
                    )}

                    {!localStorage.getItem('token') ? (
                    // Agar token MAUJOOD NAHI hai (matlab user
                    // login nahi), to ye wala JSX dikhao...
                        <Link className='header-btn' to='/login'>LOGIN</Link>
                    // "LOGIN" button dikhado jo /login page par le
                    // jaye.
                ) : (
                    // ...warna (matlab token maujood hai, user
                    // login hai) ye wala JSX dikhao:
                        <button className='header-btn logout-btn' onClick={handleLogout}>LOGOUT</button>
                    // "LOGOUT" button, jise click karne par upar
                    // wala handleLogout function chalega.
                    )}
                    {localStorage.getItem('token') && (
                        <Link className='header-btn' to='/liked-products'>FAVORITES</Link>
                    )}
                    {localStorage.getItem('token') && (
                        <Link className='header-btn' to='/chats'>Chats</Link>
                    )}
                </div>}
                
            </div>
        </div>
    );
}

export default Header;
// Is component ko export kar rahe hain taake Home.jsx aur
// AddProduct.jsx isay "import Header from './header'" likh kar
// use kar sakein.