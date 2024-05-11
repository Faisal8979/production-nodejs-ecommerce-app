const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary');
const Stripe = require("stripe");
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');


dotenv.config();
require('./config/db')
//Stripe Configration
 const stripe = new Stripe(process.env.STRIPE_API_SECRET);
module.exports = stripe;
//cloudinary Config
cloudinary.v2.config({
   cloud_name: process.env.CLOUDNARY_NAME,
   api_key: process.env.CLOUDNARY_APIKEY,
   api_secret: process.env.CLOUDNARY_SECRET
});


//Middlewere
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// Routes Require
const TestRoutes = require('./routes/TestRoutes');

//Routes
app.use('/api/v1/', TestRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/api/v1/user', userRoutes);
const productsRoutes = require("./routes/productsRoutes");
app.use('/api/v1/product', productsRoutes);
const categoryRoutes = require("./routes/categoryRoutes");
app.use('/api/v1/category', categoryRoutes);
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/v1/order", orderRoutes);

app.get("/", (req, res)=>{
    return res.status(200).send("<h1>Hello </h1>")
})

app.listen(port , ()=>{
    console.log(`Server Run Port Number ${process.env.PORT} on ${process.env.NODE_ENV} mode`.bgMagenta.white);
})