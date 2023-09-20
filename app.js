const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItems = require('./models/cartItems')
const Order = require('./models/order')
const OrderItem = require('./models/orderItems')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user = user
        next();
    })
    .catch(err=>{
        console.log(err)
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

//Settting Up Realtions
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'})
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User)
Cart.belongsToMany(Product,{through:CartItems})
Product.belongsToMany(Cart,{through:CartItems})
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product,{through:OrderItem});

sequelize.sync()
// sequelize.sync({force:true})
.then(result=>{
    return User.findByPk(1)
}).then(user=>{
    if(!user){
          return User.create({name:"Arbind Sah",email:"SHa.arvind99@gmail.com"})
    }
    return user
}).then(user=>{
    user.createCart()
}).then(cart=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err)
})

