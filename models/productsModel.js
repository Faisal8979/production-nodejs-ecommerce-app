const mongoose = require('mongoose');

//Revuew Model
const reviewSchema = new mongoose.Schema({
    name :{
        type: String,
        required : [true, "Name Is Required"]
    },
    rating :{
        type : Number,
        default: 0,
    },
    comment :{
        type : String,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref :'Users',
        required : [true, "User Required"]
    },
},
{ timestamps: true} );

//Product Model
const productSchema = new mongoose.Schema({

    name:{
        type: String,
        required: [true, "Product Name Is Required"]
    },
    description:{
        type: String,
        required: [ true, "Product Description Is Required"]
    },
    price:{
        type: String,
        required: [true, "Product Price Is Required"]
    },
    stock:{
        type: String,
        required: [true, "Product Stock Is Required"]
    },
    // quantity:{
    //     type: String,
    //     required: [true, "Product Quantity Is Required"]
    // },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    images:[
    {
    public_id: String,
    url: String,       
    }, 
],
reviews :[reviewSchema],
rating:{
    type: Number,
    default:0,
},
numReviews : {
    type:Number,
    default: 0,
},
},
{
    timestamps: true
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;