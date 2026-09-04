// ==========================================================
// index.js — ZERO LEVEL / BEGINNER EXPLANATION (Roman Urdu)
// Ye original code hai, sirf har line ke saamne comment likha
// gaya hai taake beginner ko samajh aaye ye line kya kar rahi hai
// Ye file BACKEND (Node.js + Express) ka server hai.
// ==========================================================

const express = require('express')
// "express" library import ki — ye Node.js mein server (API)
// banane ke liye sab se popular framework hai. "require" Node.js
// ka apna tareeqa hai kisi library/file ko import karne ka
// (jaisa React mein "import" hota hai).

const multer  = require('multer')
// "multer" ek library hai jo file-upload (jaise product image)
// handle karne ke liye use hoti hai — form-data se aayi file ko
// server par save karti hai.

const path = require('path');
// Node.js ka built-in "path" module — file/folder ke paths
// (address) sahi tareeqe se banane ke liye use hota hai (taake
// Windows/Linux dono par sahi kaam kare).

const cors = require('cors')
// "cors" library — CORS (Cross-Origin Resource Sharing) allow
// karne ke liye. Isse React app (jo alag port, jaise 3000, par
// chal raha hai) is backend (port 4000) ko request bhej sakta
// hai, warna browser security ki wajah se rok deta.

var jwt = require('jsonwebtoken');
// "jsonwebtoken" library — login ke waqt ek "token" banane ke
// liye use hoti hai jo user ke login-proof ki tarah kaam karta
// hai (JWT = JSON Web Token).

const bodyParser = require('body-parser')
// "body-parser" — incoming request ke "body" (jo data frontend
// se aata hai) ko parse (samajhne layak format mein convert)
// karne ke liye use hota hai.

const app = express()
// Express ka ek "app" object bana liya — yehi hamara poora
// server hai. Isi par hum routes (jaise /login, /signup)
// define karenge.

const storage = multer.diskStorage({
  // multer ko batate hain ke upload hone wali files ko KAISE
  // aur KAHAN save karna hai — "diskStorage" matlab seedha
  // computer/server ki disk par save hongi.

  destination: function (req, file, cb) {
    cb(null, 'uploads')
    // "destination" function batata hai KIS FOLDER mein file
    // save honi chahiye — yahan "uploads" naam ka folder use ho
    // raha hai. "cb" (callback) ka pehla parameter error ke liye
    // hai (yahan "null" matlab koi error nahi), doosra parameter
    // folder ka naam hai.
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // Har file ka ek UNIQUE naam banane ke liye current time
    // (Date.now()) aur ek random number ko jod rahe hain — taake
    // agar do log ek jaisi naam ki file upload karein, to bhi
    // dono ka final naam alag rahe aur ek doosre ko overwrite na
    // karein.
    cb(null, file.fieldname + '-' + uniqueSuffix)
    // Final filename ban raha hai: fieldname (jaise "pimage")
    // + "-" + wo unique suffix. Jaise: "pimage-1699999999-123".
  }
})

const upload = multer({ storage: storage })
// Upar wali "storage" settings ke sath multer ka ek "upload"
// object bana liya jo hum route mein middleware ki tarah use
// karenge (file receive karne ke liye).

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Ye line "uploads" folder ko PUBLIC bana rahi hai — matlab
// browser se koi bhi seedha "http://localhost:4000/uploads/xyz.jpg"
// jaisa URL khol kar wo image dekh sakta hai.
// "path.join(__dirname, 'uploads')" current folder ke andar
// "uploads" folder ka poora/absolute path banata hai.

app.use(cors());
// Poori app par CORS enable kar diya — matlab kisi bhi origin
// (frontend) se aane wali request ko allow kar diya (development
// ke liye common practice hai).

app.use(bodyParser.json());
// Agar koi request JSON format mein data bheje (jaise login
// karte waqt {username, password}), to isay parse kar ke
// "req.body" mein available karwa deta hai.

app.use(bodyParser.urlencoded({ extended: false }));
// Agar koi request normal HTML form (urlencoded format) se data
// bheje, usay bhi parse kar ke "req.body" mein available karwa
// deta hai.

const port = 4000
// Server kis PORT par chalega, uska number ek variable mein
// rakh diya — taake baar baar "4000" na likhna pade.

const mongoose = require('mongoose')
// "mongoose" library — MongoDB database ke sath aasani se kaam
// karne ke liye use hoti hai (jaise schema/model banana, data
// save/find karna).

mongoose.connect("mongodb+srv://moezbukhari42_db_user:moez2468@cluster0.uvxs5jw.mongodb.net/myapp")
// MongoDB Atlas (cloud database) se connection bana rahe hain.
// Is string mein username, password, aur database ka address
// (cluster URL) diya gaya hai, aur "/myapp" us database ka naam
// hai jisay use karna hai.



const Users = mongoose.model('Users', {
    username: String,
    password: String,
  contact: String,
  gmail: String,
    LikedProducts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Products'}]
});
// "Users" naam ka ek MODEL bana rahe hain — ye batata hai ke
// database mein "users" collection ke har document (row) mein
// do fields hongi: "username" aur "password", dono String
// (text) type ki. Is Model ke through hum database mein user
// data save/find kar sakenge.
let schema = new mongoose.Schema({
  pname: String,
  price: Number,
  pdesc: String,
  category: String,
  pimage: String,
  pimage2: String,
  addedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  pLoc: {
    type: {
      type : String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});
schema.index({ pLoc: '2dsphere' });
const Products = mongoose.model('Products', {
    pname: String,
    price: Number,
    pdesc: String,
    category: String,
    pimage: String,
    pimage2: String,
    location: String,
    addedBy:{ type: mongoose.Schema.Types.ObjectId,}
})
// "Products" naam ka model — har product document mein ye
// fields hongi: pname (naam, text), price (number), pdesc
// (description, text), category (text), pimage (image ka file
// path, text).

app.get('/', (req, res) => {
    res.send('hello...')
})
// Sab se pehla/basic route — jab koi browser mein
// "http://localhost:4000/" kholay, to server "hello..." text
// wapas bhej dega. Ye sirf check karne ke liye hai ke server
// chal raha hai ya nahi.
app.get('/search', (req,res)=>{
let search = req.query.search;
let location = req.query.location;

  const searchQuery = {
    $or: [
      { pname: { $regex: search } },
      { pdesc: { $regex: search } },
    ]
  };
  if (location) {
    searchQuery.location = location;
  }

  Products.find(searchQuery)

    .then((results)=>{
      res.send({message:'success', products: results})
    })
    .catch((err)=>{
      res.send({message:'server error'});
    })
})
app.post('/like-product',(req,res)=>{
  let productId = req.body.productId;
  let userId = req.body.userId;

  Users.updateOne({_id: userId}, {$addToSet: {LikedProducts: productId}})
  .then(() => {
    res.send({ message: 'Product liked successfully.' });
  })
  .catch((err) => {
    res.send({ message: 'Error liking product.', error: err });
  });
})

app.post('/signup', (req, res) => {
  const { username, password, contact, gmail } = req.body;
    // Frontend se POST request mein aaye "req.body" object se
    // "username" aur "password" nikaal rahe hain (object
    // destructuring).

    const user = new Users({ username, password, contact, gmail });
    // "Users" model ka istemaal kar ke ek NAYA user object bana
    // rahe hain, jisme wahi username/password bhare hain jo
    // upar nikale the.

    user.save()
    // Is naye user ko actual database mein SAVE karne ki
    // koshish kar rahe hain. ".save()" ek Promise return karta
    // hai, is liye ".then()" aur ".catch()" use ho rahe hain.
        .then(() => {
            res.send({ message: 'saved success.' })
            // Agar save successfully ho gaya, to frontend ko
            // success message wapas bhej diya.
        })
        .catch(() => {
            res.send({ message: 'server err' })
            // Agar save karte waqt koi error aaya (jaise
            // database down ho), to error message bhej diya.
        })
})

app.listen(port, () => {
    // Server ko actual mein "start"/"chalu" kar rahe hain, upar
    // wale "port" (4000) par. Callback function tab chalta hai
    // jab server successfully start ho jaye.
    // server started
})
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Login request se username/password nikaale.

    Users.findOne({ username: username })
    // Database mein "Users" collection ke andar wo EK document
    // dhoondo jiska username match kare. ".findOne()" bhi
    // Promise return karta hai.
        .then((result) => {
            // Agar query chal gayi (chahe result mila ho ya na
            // mila ho), to ye chalega. "result" ya to wo user
            // document hoga ya "null" (agar koi match na mila).

          if (!result){
          res.send({ message: 'User not found.' })  
          // Agar koi user is username se mila hi nahi
          // ("result" null hai), to yehi message bhej do.

          } else {
            // Agar user mil gaya, to andar check karo password
            // sahi hai ya nahi.

            if(result.password === password){
              // Agar database mein saved password aur frontend
              // se aaya password EXACTLY match kare...

              const token =jwt.sign({
  data: result
}, 'MYKEY', { expiresIn: '1h' });
              // ...to ek JWT TOKEN banao. "jwt.sign()" ke andar:
              // - pehla parameter: wo data jo token ke andar
              //   "chhupa" ke rakhna hai (yahan poora "result",
              //   matlab user ka data).
              // - doosra parameter: ek "secret key" ('MYKEY')
              //   jo token ko sign/secure karti hai.
              // - teesra parameter: options — { expiresIn: '1h' }
              //   ka matlab ye token sirf 1 ghante ke liye valid
              //   rahega, us ke baad expire ho jayega.

                res.send({ message: 'find success.',token : token,userId: result._id })
                // Success message ke sath ye token bhi frontend
                // ko bhej diya, taake frontend isay localStorage
                // mein save kar sake (login-proof ki tarah).

            } else {
                res.send({ message: 'password wrong.' })
                // Agar password match nahi hua, to ye message
                // bhej do.
            }
          }
        })
        .catch(() => {
            res.send({ message: 'server err' })
            // Agar database query mein hi koi error aa jaye.
        })
})
 app.post('/add-product',upload.fields([{ name: 'pimage', maxCount: 1 }, { name: 'pimage2', maxCount: 1 }]),(req,res)=>{
  // Ye route naya product add karne ke liye hai.
  // "upload.single('pimage')" ek MIDDLEWARE hai jo is route par
  // pahunchne se pehle chalta hai — ye request mein se sirf EK
  // file (jiska field-name 'pimage' ho) uthata hai, usay
  // "uploads" folder mein save karta hai, aur uski details
  // "req.file" mein daal deta hai. Baaki normal text fields
  // "req.body" mein aa jati hain.

  const product = new Products({ pname: req.body.pname,
     price: req.body.price,
      pdesc: req.body.pdesc,
       category: req.body.category,
        pimage: req.files.pimage && req.files.pimage.length > 0 ? req.files.pimage[0].path : '' ,
        pimage2: req.files.pimage2 && req.files.pimage2.length > 0 ? req.files.pimage2[0].path : '' ,
        location: req.body.location,
        addedBy: req.body.userId});
  // "Products" model ka istemaal kar ke naya product object
  // bana rahe hain:
  // - pname, price, pdesc, category → "req.body" se (normal
  //   text fields jo frontend ne FormData mein bheje the)
  // - pimage → "req.file.path" se, matlab jahan multer ne
  //   actual image FILE ko disk par save kiya, uska path yahan
  //   database mein bhi save kar rahe hain.

   product.save()
   // Naye product ko database mein save karne ki koshish.
        .then(() => {
            res.send({ message: 'saved success.' })
            // Save ho gaya to success message.
        })
        .catch(() => {
            res.send({ message: 'server err' })
            // Koi error aaya to error message.
        })
    
  })
  app.get('/get-products',(req,res)=>{

const catName = req.query.catName;
 


    // Ye route SAARE products database se wapas laane ke liye
    // hai — Home.jsx isi route ko call karta hai.

    Products.find(catName ? { category: new RegExp('^' + catName + '$', 'i') } : {})
    // "Products" collection ke SAARE documents dhoondo (koi
    // filter/condition nahi di, is liye sab mil jayenge).
    .then((result)=>{
        res.send({message:'success', products: result})
        // Mile hue saare products ko "products" key ke andar
        // frontend ko bhej diya, sath ek success message bhi.
    })
    .catch((err)=>{
        res.send({message:'server error'});
        // Agar query fail ho jaye, to error message bhej diya.
    })
  })

  app.get('/product/:id', (req, res) => {
    Products.findById(req.params.id)
      .then((result) => {
        if (!result) {
          return res.status(404).send({ message: 'Product not found.' });
        }
        res.send({ message: 'success', product: result });
      })
      .catch(() => {
        res.status(400).send({ message: 'Invalid product id.' });
      });
  });

  app.post('/Liked-products', (req, res) => {
    Users.findById(req.body.userId).populate('LikedProducts')
      .then((result) => {
        if (!result) {
          return res.status(404).send({ message: 'User not found.', products: [] });
        }
        res.send({ message: 'success', products: result.LikedProducts || [] });
      })
      .catch(() => {
        res.status(400).send({ message: 'Unable to load liked products.', products: [] });
      });
  });
  app.post('/My-products', (req, res) => {
    Products.find({ addedBy: req.body.userId })
      .then((result) => {
        res.send({ message: 'success', products: result });
      })
      .catch(() => {
        res.status(400).send({ message: 'Unable to load my products.', products: [] });
      });
  });
  app.get('/get-user/:uId',(req,res)=>{
    const userId = req.params.uId;
    Users.findById(userId)
      .then((result) => {
        if (!result) {
          return res.status(404).send({ message: 'User not found.' });
        }
        res.send({ message: 'success', user: result });
      })
      .catch(() => {
        res.status(400).send({ message: 'Invalid user id.' });
      });
  });