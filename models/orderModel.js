const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema(
    {
      shippingInfo :{
        address: {
            type: String,
            required : [true, " Address Is Required"]
        },
        city :{
          type: String,
          required: [true, "City Name Is Required"]
        },
        country:{
          type: String,
          required: [true, "Country Name Is Required"]
        },
      },
    
      orderItem :[
        {
            name:{
                type: String,
                required : [true, " Product Name Is Required"]
              },
              price:{
                type: String,
                required : [true, " Product Price Is Required"]
              },
              quntity:{
                type: String,
                required : [true, " Product Quantity Is Required"]
              },
              image:{
                type: String,
                required : [true, " Product Image Is Required"]
              },
              product :{
                type : mongoose.Schema.Types.ObjectId,
                ref : "Product",
                required: true,
              }
        }
      ],
     paymentMethod:{
        type:String,
        enum:["COD", "ONLINE"],
        default:"COD",
     },
     user:{
        type:mongoose.Schema.Types.ObjectId,
        ref :"user",
        required: [true, " User Id Is Required"]
     },
     paidAt: Date,
     paymentInfo : {
        id: String,
        status: String,
     },
     itemPrice :{
        type : Number,
        required : [true, " Item Price Is Required"]
     },
     tax :{
        type : Number,
        required : [true, " Tax Price Is Required"]
     },
     shippingCharges :{
        type : Number,
        required : [true, " Shipping Charges Is Required"]
     },
     totalAmount :{
        type : Number,
        required : [true, " Total Amount Price Is Required"]
     },
     orderStatus :{
        type : String,
        enum : ['processing', 'shipped', 'deliverd'],
        default:'processing',
     },
     deliverAt :Date,
     },
{
    timestamps: true
});

const orderModel = mongoose.model("Orders", orderSchema);

module.exports = orderModel;