const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/edit-products',
    editing: false
  });
  
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const descriptions = req.body.descriptions;
  req.user.createProduct({
    title:title,
    imageUrl:imageUrl,
    price:price,
    descriptions : descriptions
  }).then(result=>{
    res.redirect('/admin/products');
  }).catch(err=>{
    console.log(err)
  })

};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({where:{id:prodId}})
  // Product.findByPk(prodId)
  .then(product=>{
    console.log(product[0])
      if (!(product[0])) {
      return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product[0]
      });  
  })
  .catch(err=>{
    console.log(err)
  })
};


exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.descriptions;

  const updatedValues = {
      title : updatedTitle,
      price : updatedPrice,
      imageUrl : updatedImageUrl,
      descriptions : updatedDesc
      }
    Product.update(updatedValues,{
      where : {id : prodId}
    }).then(updatedResult=>{
      console.log("Product Updated Successfully")
      res.redirect('/admin/products')
    })
    .catch(err=>{
      console.log(err)
    })
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  // Product.findAll()
  .then(products=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.deleteById(prodId);
  Product.findByPk(prodId)
  .then(product=>{
    return product.destroy()
  }).then(result=>{
    console.log("Product Deleted Successfully")
    res.redirect('/admin/products')
  })
  .catch(err=>{
    console.log(err)
  })
  // res.redirect('/admin/products');
};