    const mongodb = require('mongodb')

    const getDb = require('../util/database').getDb

    class User {
        constructor(email, name, phoneNum, cart, id) {
            this.email = email
            this.name = name
            this.phoneNum = phoneNum
            this.cart = cart
            this._id = id
        }

        save() {
            const db = getDb();
            return db.collection('users').insertOne(this)
        }

        addToCart(product) {
            // cart:{ 
            //     items:[ {productId:something,quantity:someNumber},
            //             {productId:something,quantity:someNumber},
            //             {productId:something,quantity:someNumber}
            //          ] 
            // }
            const cartItemIndex = this.cart.items.findIndex(cp => {
                return cp.productId.toString() == product._id.toString()
            });
            let newQuantity = 1;
            const updateCartItems = [...this.cart.items]
            if (cartItemIndex >= 0) {
                newQuantity = this.cart.items[cartItemIndex].quantity + 1
                updateCartItems[cartItemIndex].quantity = newQuantity;
            } else {
                updateCartItems.push({
                    productId: new mongodb.ObjectId(product._id),
                    quantity: 1
                })
            }
            const updatedCart = {
                items: updateCartItems
            }
            const db = getDb();
            return db.collection('users')
                .updateOne({
                    _id: new mongodb.ObjectId(this._id)
                }, {
                    $set: {
                        cart: updatedCart
                    }
                })
        }

        getCart() {
            const db = getDb();
            const productIds = this.cart.items.map(i => {
                return i.productId
            })
            return db.collection('products')
                .find({
                    _id: {
                        $in: productIds
                    }
                })
                .toArray()
                .then(products => {
                    return products.map(p => {
                        return {
                            ...p,
                            quantity: this.cart.items.find(item => {
                                return item.productId.toString() == p._id.toString()
                            }).quantity

                        }
                    })
                })
        }

        deleteCartItems(productId) {
            const db = getDb();
            const updatedCartItems = this.cart.items.filter(item => {
                return item.productId.toString() !== productId.toString()
            })
            return db.collection('users')
                .updateOne({
                    _id: new mongodb.ObjectId(this._id)
                }, {
                    $set: {
                        cart: {
                            items: updatedCartItems
                        }
                    }
                })
        }

        addOrders() {
            const db = getDb();
            return this.getCart()
            .then(products=>{
                const orders = {
                    items : products,
                    user:{
                        _id : this._id,
                        name : this.name,
                        email:this.email,
                        phoneNum : this.phoneNum
                    }

                }
                return db.collection('orders')
                    .insertOne(orders)
            })
            .then(result => {
                    this.cart = {
                        items: []
                    }
                    return db.collection('users')
                        .updateOne({
                            _id: new mongodb.ObjectId(this._id)
                        }, {
                            $set: {
                                cart: {
                                    items: []
                                }
                            }
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        }

        getOrders(){
            const db = getDb();
            return db.collection('orders')
            .find({'user._id' : new mongodb.ObjectId(this._id)})
            .toArray()
        }

        static findUserById(prodId) {
            const db = getDb();
            return db.collection('users')
                .findOne({
                    _id: new mongodb.ObjectId(prodId)
                })
                .then(user => {
                    return user
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    module.exports = User;