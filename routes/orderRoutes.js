const express = require("express");
const isAuth = require("../middlewere/authMiddlewere");
const isAdmin = require("../middlewere/authMiddlewere")
const singleUpload = require("../middlewere/multer");
const {
    orderController,
    getMyOrdersController,
    mySingleOrderController,
    paymentsController,
    getAllOrdersController,
    changeOrderStatusController
 }
  = require("../controllers/orderController");


const router = express.Router();

// ======= Orders  Routes ========

// Create Category

router.post('/create', isAuth, orderController);

// Get All Order
router.get("/my-orders", isAuth, getMyOrdersController);
// Get Single Order
router.get("/my-order/:id", isAuth, mySingleOrderController);

//Accept Payment
router.post("/payments", isAuth, paymentsController);

//==== ADMIN PART =====

//Get All Order
router.get("/admin/get-all-orders", isAuth, isAdmin, getAllOrdersController);

//Change Order Status

router.put("/admin/order/:id", isAuth, isAdmin , changeOrderStatusController)


module.exports = router;