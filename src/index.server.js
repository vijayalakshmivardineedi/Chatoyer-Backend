const express=require("express")
const env = require('dotenv')
const mongoose=require("mongoose")
const app=express()
const path=require('path');
const cors =require('cors')



//routes

const authRoutes=require('./routes/auth')
const adminRoutes=require('./routes/admin/auth')
const categoryRoutes=require('./routes/category');
const productRoutes=require('./routes/product');
const productscalRoutes=require('./routes/productscal');
const cartRoutes=require('./routes/cart');
const wishlistRoutes=require('./routes/wishlist');
const initialDataRoutes=require('./routes/admin/initialData');
const orderRoutes = require("./routes/order");
const couponsRoutes = require("./routes/coupons");
const checkoutRoutes = require("./routes/checkout");
const goldRateRoutes = require("./routes/goldRate");

  
env.config()
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.lznvawo.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => {
  console.log("Database Connected");
})
.catch((err) => {
  console.error("Error connecting to the database:", err);
});
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'CategoriesImages')));
app.use('/publicProduct', express.static(path.join(__dirname, 'ProductsImages')));
app.use('/publicUser', express.static(path.join(__dirname, 'UserImages')));

app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', productscalRoutes);
app.use('/api', cartRoutes);
app.use('/api', wishlistRoutes);
app.use('/api', initialDataRoutes);
app.use("/api", orderRoutes);
app.use("/api", couponsRoutes);
app.use("/api", checkoutRoutes);
app.use("/api", goldRateRoutes);

app.listen(2000,()=>{
    console.log(`Server is runnung on Port 2000`)
});
