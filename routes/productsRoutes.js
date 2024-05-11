const express = require("express");
const  {
       getAllProductController ,
       getSingleProductController,
       createProductController,
       updateProductController,
       productImageUpdateController,
       deleteProductImageController,
       deleteProductController,
       productReviewController,
       getTopProductController
    }
 = require("../controllers/productController");
const isAuth = require("../middlewere/authMiddlewere");
const singleUpload = require("../middlewere/multer");
const isAdmin = require("../middlewere/authMiddlewere");

const router = express.Router();

//Routes

// Get All Products

router.get('/get-all', getAllProductController);

// Get Top Products

router.get('/top', getTopProductController);
// Get Single Product

router.get('/:id' , getSingleProductController);

//Create Prouct 

router.post("/create", isAuth, isAdmin, singleUpload, createProductController);

//Update Product

router.put("/:id", isAuth ,isAdmin, updateProductController);

//Update Product Image

router.put("/images/:id", isAuth,  isAdmin, singleUpload, productImageUpdateController);

//Delete Product Image

router.delete("/delete-image/:id", isAuth, isAdmin,  deleteProductImageController);

//Delete Product 
router.delete("/delete/:id", isAuth, isAdmin,  deleteProductController);

//Review Product 
router.put("/:id/review", isAuth, productReviewController)

module.exports = router;