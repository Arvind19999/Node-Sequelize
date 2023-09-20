const Product = require('../models/product');
const Cart = require('../models/cart');
const {
  where
} = require('sequelize');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(prodcuts => {
      res.render('shop/product-list', {
        prods: prodcuts,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err)
    })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      console.error(err)
    });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      })
    })
    .catch(err => {
      console.log(err)
    })
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      return cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        }).catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let newQuantity = 1
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({
        where: {
          id: prodId
        }
      })
    }).then(products => {
      let product;
      if (products.length > 0) {
        product = products[0]
      }
      if (product) {
        const oldQunatity = product.cartItem.quantity
        newQuantity = oldQunatity + 1
        return product
      }
      return Product.findByPk(prodId)
    })
    .then(product => {
      console.log("This is the begining")
      console.log(product)
      return fetchedCart.addProduct(product, {
        through: {
          quantity: newQuantity
        }
      })
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err)
    })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart=>{
    return cart.getProducts({
      where:{id : prodId}
    })
  }).then(products=>{
    products[0].cartItem.destroy()
  }).then(result=>{
    res.redirect('/cart');
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.postOrders =(req,res,next)=>{
  let fetchedCart;
  req.user.getCart()
  .then(cart=>{
    fetchedCart = cart;
    return cart.getProducts()
  }).then(products=>{
    req.user.createOrder()
    .then(order=>{
      return order.addProducts(products.map(product=>{
        product.orderItem = {quantity : product.cartItem.quantity}
        return product
      }))
    }).catch(err=>{
      console.log(err)
    })
  }).then(result=>{
    return fetchedCart.setProducts(null)
    // console.log(result)
    
  }).then(result=>{
    res.redirect('/orders')
  })
  .catch(err=>{
    console.log(err)
  })
}

exports.getOrders = (req, res, next) => {
req.user.getOrders({include:['products']})
.then(orders=>{
  console.log(orders)
  console.log("***********************************************")
  console.log(orders[0].dataValues.products[0])

  res.render('shop/orders', {
  path: '/orders',
  pageTitle: 'Your Orders',
  orders : orders
});
})
.catch(err=>{
  console.log(err)
})
};



exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};