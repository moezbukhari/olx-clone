
export const BASE_URL = process.env.NODE_ENV === 'development'
	? 'http://localhost:4000'
	: 'https://olx-clone-o02c.onrender.com';

export const SIGNUP_URL = BASE_URL + '/signup';
export const LOGIN_URL = BASE_URL + '/login';
export const ADD_PRODUCT_URL = BASE_URL + '/add-product';
export const PRODUCTS_URL = BASE_URL + '/get-products';
export const SEARCH_URL = BASE_URL + '/search';
export const LIKE_PRODUCT_URL = BASE_URL + '/like-product';
export const LIKED_PRODUCTS_URL = BASE_URL + '/Liked-products';
export const MY_PRODUCTS_URL = BASE_URL + '/My-products';
export const PRODUCT_URL = BASE_URL + '/product';
export const USER_URL = BASE_URL + '/get-user';
export const MESSAGES_URL = BASE_URL + '/messages';
export const CONVERSATION_URL = MESSAGES_URL + '/conversation';
export const CONVERSATIONS_URL = MESSAGES_URL + '/conversations';