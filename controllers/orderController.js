//Create Order

const orderModel = require("../models/orderModel");
const productModel = require("../models/productsModel");
const stripe = require("../server");

const orderController = async (req, res) =>{
    try {
        const {
            shippingInfo,
            orderItem,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount
              } 
             = req.body;
        //Validation
        // if(!shippingInfo || !orderItem || !paymentMethod || !paymentInfo || !itemPrice || !tax || !shippingCharges || !totalAmount){
        //     return res.status(404).send({
        //         success : false,
        //         message: "Order Not Found",
        //     })
        // }
        //Create Order
        await orderModel.create({
            user: req.user._id,
            shippingInfo,
            orderItem,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount
        })
//Stock Update
for (let i=0; i < orderItem.length; i++){
    //Find Product
   const product = await productModel.findById(orderItem[i].product);
    product.stock -= orderItem[i].quntity;
    await product.save();
}
  res.status(201).send({
    success: true,
    message: "Order Placed Successfully",
  });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Create Order API"
        })
    }
}

//Get All Orders -- My Oreders

const getMyOrdersController = async (req, res) =>{
   try {
   // Find Orders
   const orders = await orderModel.find({ user: req.user._id });
   //Validation
   if (!orders) {
     return res.status(404).send({
       success: false,
       message: "no orders found",
     });
   }
   res.status(200).send({
     success: true,
     message: "your orders data",
     totalOrder: orders.length,
     orders,
   });
   } catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "Error In My Order API",
        error,
    })
   }
}
//Get Single Order Info
const mySingleOrderController = async (req, res) =>{
   try {
      const order = await orderModel.findById(req.params.id);

      //Validation
      if(!order){
        return res.status(404).send({
            success:false,
            message: "Order Not Found"
        })
      }
      res.status(200).send({
        success:true,
        message:'Your Order Fetch Successfully',
        order,
      })
   } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
        success: false,
        message: "Error In Single Order API",
        error,
      });
   }
}

//Accept Payment

const paymentsController = async (req, res) =>{
      try {
        //Get Amount
        const {totalAmount} = req.body;
        //Validation 
        if(!totalAmount){
            return res.status(404).send({
                success:false,
                message: "Total Amount Is Required"
            })
        }
        const {client_secret} = await stripe.paymentIntents.create({
          amount : Number(totalAmount * 100),
          currency:'usd'
         })
         res.status(200).send({
            success:true,
            client_secret,
         })
      } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Single Order API",
            error,
          });
      }
}

//====== ADMIN SECTION =====

const getAllOrdersController = async (req, res) =>{
   try {
    const orders = await orderModel.find({});
    if(!orders){
        return res.status(404).send({
            success: false,
            message: "Order Not Found"
        })
    }
    res.status(200).send({
        success: true,
        message: " All Orders Data",
        totalOrders: orders.length,
        orders,
    })
   } catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "Error In Single Order API",
        error,
      });
   }
}

//Change Order Status

const changeOrderStatusController = async (req, res) =>{
   try {
     //Find Order
     const order = await orderModel.findById(req.params.id)
     //Validation
     if(!order){
      return res.status(404).send({
        success: false,
        message: "Order Not Found"
      })
     }
     if(order.orderStatus === 'processing') order.orderStatus = 'shipped'
     else if(order.orderStatus === 'shipped'){
      order.orderStatus = 'deliverd'
      order.deliverAt = Date.now()
     } else{
      return res.status(500).send({
        success: false,
        message :"Order Already Deliverd"
      })
     }
     await order.save()
     res.status(200).send({
      success:true,
      message:"Order Status Updated"
     })
   } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
        success: false,
        message: "Error In Single Order API",
        error,
      });
   }
}

module.exports = {
    orderController,
    getMyOrdersController,
    mySingleOrderController,
    paymentsController,
    getAllOrdersController,
    changeOrderStatusController
};