// const Sequelize = require('sequelize')

// const { ConnectionAcquireTimeoutError } = require('sequelize');

// const sequelize = require('../util/database')
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;


class Product{
  constructor(title,imageUrl,price,descriptions,id,userId){
    this.title = title
    this.imageUrl = imageUrl
    this.price = price
    this.descriptions = descriptions
    this._id = id
    this.userId = userId
  }

  save(){
    const db = getDb()
    let dbOp;
    if(this._id){
      //Update Product
      dbOp = db.collection('products').updateOne({_id : new mongodb.ObjectId(this._id)},{$set:this})
    }else{
      dbOp = db.collection('products').insertOne(this)
    }
    return dbOp.then(results=>{
      console.log("Here is the product that needs to be inserted")
        console.log(results)
    })
    .catch(err=>{
      console.log(err)
    }) 
  }

  static fetchAll(){
    const db = getDb();
    return db.collection('products')
    .find()
    .toArray()
    .then(products =>{
      // console.log(products)
      return products
    })
    .catch(err=>{
      console.log(err)
    })
  }

static findById(prodId){
  const db = getDb();
  return db.collection('products')
  .find({_id: new mongodb.ObjectId(prodId)})
  .next()
  .then(product=>{
    console.log(product)
    return product
  })
  .catch(err=>{
    console.log(err)
  })
}

static deleteById(prodId){
  const db = getDb();
  return db.collection('products')
  .deleteOne({_id : new mongodb.ObjectId(prodId)})
  .then(product=>{
    // console.log(product)
    console.log("Deleted")
  })
  .catch(err=>{
    console.log(err)
  })
}
}

module.exports = Product;