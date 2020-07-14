const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-items');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// create relations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem});


// creates a table if it does not yet exist using the model
// starts server only if successful
// sequelize.sync({force: true}) // do not force in production
sequelize
.sync()
// .sync({force: true})
.then(result => {
  return User.findByPk(1); // dummy code
})
.then(user => {
  if (!user) {
    return User.create({ name: 'Sanders', email: 'sanders@gmail.com' })
  }
  return user;
})
.then(user => {
 // console.log(user);
  return user.createCart();
})
.then(cart => {  
  app.listen(3000);
})
.catch(err => {
  console.log('Error creating a CART ASSOCIATED WITH A USER', err);
  console.log('------------\n')
})

