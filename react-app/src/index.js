//import React from 'react';
//import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
//import reportWebVitals from './reportWebVitals';

//const root = ReactDOM.createRoot(document.getElementById('root'));
//root.render(
  //<React.StrictMode>
    //<App />
  //</React.StrictMode>
//);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/home';
import Login from './components/Login';
import Signup from './components/Signup';
import AddProduct from './components/AddProduct';
import ProductDetail from './components/ProductDetail';
import LikedProducts from './components/LikedProducts';
import MyProducts from './components/MyProducts';
import MyProfile from './components/MyProfile';
import CategoryPage from './components/CategoryPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: (<Home/>),
      //<div>
        //<h1>Hello World</h1>
        //<Link to="/about">About Us</Link>
      //</div>
    
  },
  {
    path: "/about",
    element: <div>About</div>,
  },
   {
    path: "/login",
    element: (<Login/>),  
  },
  {
    path: "/signup",
    element: (<Signup/>),
  },
  {
    path: "/add-product",
    element: (<AddProduct/>),
  },
  {
    path: "/product/:id",
    element: (<ProductDetail/>),
  },
  {
    path: "/liked-products",
    element: (<LikedProducts/>),
  },
  {
    path: "/my-products",
    element: (<MyProducts/>),
  },
  {
    path: "/my-profile",
    element: (<MyProfile/>),
  },
  {
    path: "/category/:catName",
    element: (<CategoryPage/>),
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <RouterProvider router={router} />
);