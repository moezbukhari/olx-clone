const mongoose = require('mongoose');

const Users = mongoose.models.Users || mongoose.model('Users', {
  username: String,
  password: String,
  contact: String,
  gmail: String,
  LikedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }]
});

const Products = mongoose.models.Products || mongoose.model('Products', {
  pname: String,
  price: Number,
  pdesc: String,
  category: String,
  pimage: String,
  pimage2: String,
  location: String,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
});

module.exports.searchProducts = async (req, res) => {
  const { search, location } = req.query;
  const searchQuery = {};

  if (search) {
    searchQuery.$or = [
      { pname: { $regex: search, $options: 'i' } },
      { pdesc: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }
  if (location) {
    searchQuery.location = location;
  }

  try {
    const results = await Products.find(searchQuery);
    res.send({ message: 'success', products: results });
  } catch (err) {
    res.send({ message: 'server error' });
  }
};

module.exports.likeProduct = (req, res) => {
  const { productId, userId } = req.body;

  Users.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }

      const isLiked = (user.LikedProducts || []).some((id) => id.toString() === productId);
      console.log('[like-product] before', { productId, userId, isLiked, likedProducts: user.LikedProducts });
      const update = isLiked
        ? { $pull: { LikedProducts: productId } }
        : { $addToSet: { LikedProducts: productId } };

      return Users.updateOne({ _id: userId }, update)
        .then((result) => Users.findById(userId).then((updatedUser) => {
          console.log('[like-product] after', { operation: isLiked ? '$pull' : '$addToSet', result, likedProducts: updatedUser.LikedProducts });
          res.send({ message: isLiked ? 'Product unliked successfully.' : 'Product liked successfully.', liked: !isLiked });
        }));
    })
    .catch((err) => res.send({ message: 'Error updating product like.', error: err }));
};

module.exports.addProduct = (req, res) => {
  const product = new Products({
    pname: req.body.pname,
    price: req.body.price,
    pdesc: req.body.pdesc,
    category: req.body.category,
    pimage: req.files.pimage && req.files.pimage.length > 0 ? req.files.pimage[0].path : '',
    pimage2: req.files.pimage2 && req.files.pimage2.length > 0 ? req.files.pimage2[0].path : '',
    location: req.body.location,
    addedBy: req.body.userId
  });

  product.save()
    .then(() => res.send({ message: 'saved success.' }))
    .catch(() => res.send({ message: 'server err' }));
};

module.exports.getProducts = (req, res) => {
  const catName = req.query.catName;
  const query = catName ? { category: new RegExp('^' + catName + '$', 'i') } : {};

  Products.find(query)
    .then((result) => res.send({ message: 'success', products: result }))
    .catch(() => res.send({ message: 'server error' }));
};

module.exports.getProduct = (req, res) => {
  Products.findById(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'Product not found.' });
      }
      res.send({ message: 'success', product: result });
    })
    .catch(() => res.status(400).send({ message: 'Invalid product id.' }));
};

module.exports.getLikedProducts = (req, res) => {
  Users.findById(req.body.userId).populate('LikedProducts')
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'User not found.', products: [] });
      }
      res.send({ message: 'success', products: result.LikedProducts || [] });
    })
    .catch(() => res.status(400).send({ message: 'Unable to load liked products.', products: [] }));
};

module.exports.getMyProducts = (req, res) => {
  Products.find({ addedBy: req.body.userId })
    .then((result) => res.send({ message: 'success', products: result }))
    .catch(() => res.status(400).send({ message: 'Unable to load my products.', products: [] }));
};

module.exports.updateProduct = (req, res) => {
  const update = {
    price: req.body.price,
    pdesc: req.body.pdesc
  };

  if (req.files.pimage && req.files.pimage.length > 0) {
    update.pimage = req.files.pimage[0].path;
  }
  if (req.files.pimage2 && req.files.pimage2.length > 0) {
    update.pimage2 = req.files.pimage2[0].path;
  }

  Products.findOneAndUpdate(
    { _id: req.params.id, addedBy: req.body.userId },
    update,
    { new: true }
  )
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'Product not found.' });
      }
      res.send({ message: 'Product updated successfully.', product: result });
    })
    .catch(() => res.status(400).send({ message: 'Unable to update product.' }));
};

module.exports.deleteProduct = (req, res) => {
  Products.findOneAndDelete({ _id: req.params.id, addedBy: req.body.userId })
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'Product not found.' });
      }
      res.send({ message: 'Product deleted successfully.' });
    })
    .catch(() => res.status(400).send({ message: 'Unable to delete product.' }));
};
