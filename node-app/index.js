const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');

const app = express();
const port = process.env.PORT || 4000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});
const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb+srv://moezbukhari42_db_user:moez2468@cluster0.uvxs5jw.mongodb.net/myapp');

app.get('/', (req, res) => res.send('hello...'));
app.get('/search', productController.searchProducts);
app.post('/like-product', productController.likeProduct);
app.post('/add-product', upload.fields([
  { name: 'pimage', maxCount: 1 },
  { name: 'pimage2', maxCount: 1 }
]), productController.addProduct);
app.get('/get-products', productController.getProducts);
app.get('/product/:id', productController.getProduct);
app.put('/product/:id', upload.fields([
  { name: 'pimage', maxCount: 1 },
  { name: 'pimage2', maxCount: 1 }
]), productController.updateProduct);
app.delete('/product/:id', productController.deleteProduct);
app.post('/Liked-products', productController.getLikedProducts);
app.post('/My-products', productController.getMyProducts);

app.post('/signup', userController.signup);
app.post('/login', userController.login);
app.get('/get-user/:uId', userController.getUser);

app.listen(port, () => {
  console.log('server started on port ' + port);
});
