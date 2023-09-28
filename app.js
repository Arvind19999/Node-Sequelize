    const path = require('path');

    const express = require('express');
    const bodyParser = require('body-parser');

    const errorController = require('./controllers/error');
    const mongoConnect  = require('./util/database').mongoConnect;
    const User = require('./models/user');

    const app = express();

    app.set('view engine', 'ejs');
    app.set('views', 'views');

    const adminRoutes = require('./routes/admin');
    const shopRoutes = require('./routes/shop');

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use((req,res,next)=>{
        User.findUserById('651296659e614caab9a0bb97')
        .then(user=>{
            // console.log("Here is the user")
            req.user = new User(user.email, user.name, user.phoneNum, user.cart, user._id)
            next();
        })
        .catch(err=>{
            console.log(err)
        })
        
    })

    app.use('/admin', adminRoutes);
    app.use(shopRoutes);
    app.use(errorController.get404);

    mongoConnect(()=>{
        app.listen(3000);
    })

