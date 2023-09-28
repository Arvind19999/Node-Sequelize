const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect =(callback)=>{
    MongoClient.connect(
        // 'mongodb+srv://shababidevi99:eVlCojMDKRlUr6xb@cluster0.dycfpyt.mongodb.net/?retryWrites=true&w=majority'
        'mongodb+srv://ArbindSHa:Bigolive99@cluster0.dycfpyt.mongodb.net/Ecommerce?retryWrites=true&w=majority'
    ).then(client=>{
        console.log('Successfully Connected To Database')
        _db = client.db()
        callback()
    }).catch(err=>{
        console.log(err)
        throw err;
    })
}

const getDb = ()=>{
    if(_db){
        return _db;
    }
    throw 'No database found'
}

// module.exports = mongoConnect;

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;