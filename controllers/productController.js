const productModel = require("../models/productsModel");
const cloudinary = require("cloudinary");
const getDataUri = require("../utills/features");

//Get All Products

const getAllProductController = async (req, res) =>{
   const {keyword, category} = req.query;
 try {
    const products = await productModel.find({
      name:{
        $regex: keyword ? keyword : "",
        $options:"i",
      },
      //category :category ? category : undefined,
    }).populate('category');
    res.status(200).send({
        success: true,
        message: " All Products Fetched Successfully..",
        totalProduct : products.length,
        products,
    })
    
 } catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: " Error In Get All Products API",
        error,
    })
 }
};

//Get Single Product

 const getSingleProductController = async (req, res) => {
    try {
      // get product id
      const product = await productModel.findById(req.params.id);
      //valdiation
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "product not found",
        });
      }
      res.status(200).send({
        success: true,
        message: "Product Found",
        product,
      });
    } catch (error) {
      console.log(error);
      // cast error ||  OBJECT ID
      if (error.name === "CastError") {
        return res.status(500).send({
          success: false,
          message: "Invalid Id",
        });
      }
      res.status(500).send({
        success: false,
        message: "Error In Get single Products API",
        error,
      });
    }
  };

  //Create Product

  const createProductController = async (req, res) =>{
  try {
    const {name, description, price, category, stock} = req.body;
    //Validation

    // if(!name || !description || !price || !stock){
    //     return res.status(500).send({
    //         success: false,
    //         message:"Please Provide All Fields",
    //     })
    // }
    if(!req.file){
        res.status(500).send({
            success: false,
            message: "Please Provide Product Image"
        })
    }
  
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content)
    const image = {
        public_id: cdb.public_id,
        url: cdb.secure_url,
    }
 
    await productModel.create({
        name,description,price,category,stock,images:[image]
        
    })
    res.status(201).send({
        success: true,
        message: " Product Created Successfully.."
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "Error In Get single Products API",
        error,
      });
    }
  };

  //UPDATE Product
  const updateProductController = async (req, res) =>{
      try {
        const product = await productModel.findById(req.params.id);
        const {name, description, price, stock, category} = req.body;
        //Validation

        if(name) product.name = name
        if(description) product.description = description
        if(price) product.price = price
        if(stock) product.stock = stock
        if(category) product.category = category

        await product.save();
        res.status(200).send({
          success: true,
          message: 'Product Details Updated.'
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
            message: "Error In Get Update Products API",
            error,
          });
    
  }
}

const productImageUpdateController = async (req, res) =>{
    try {
      const product = await productModel.findById(req.params.id)

      //Validation
      if(!product){
          return res.status(404).send({
          success:false,
          message: "Product Not Found"
        })
      }
      //Check File

      if(!req.file){
          return res.status(404).send({
          success:false,
          message: "Product Image Not Found"
        })
      }
     
      const file = getDataUri(req.file);
      const cdb = await cloudinary.v2.uploader.upload(file.content)
      const image = {
        public_id : cdb.public_id,
        url : cdb.secure_url,
      }
      product.images.push(image);

      await product.save();

      res.status(200).send({
        success: true,
        message : " Product Image Updated."
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
          message: "Error In Get Update Products API",
          error,
        });
  
    }
}
//Delete Product Image

const deleteProductImageController = async (req, res) =>{
    try {
      const product = await productModel.findById(req.params.id)
       
      //Validation 
      if(!product){
        return res.status(404).send({
          success:false,
          message: "Product Not Found"
        })
      }
      //Image Id Find

      const id = req.query.id;
      if(!id){
        return res.status(404).send({
          success:false,
          message: "Product Image Not Found"
        })
      }
      let isExist = -1;
      product.images.forEach((item, index) => {
        if (item._id.toString() === id.toString()) isExist = index;
      });
      if (isExist < 0) {
        return res.status(404).send({
          success: false,
          message: "Image Not Found",
        });
      }
      //Delete Product Image
      await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
      product.images.splice(isExist, 1);
      await product.save();
      return res.status(200).send({
        success: true,
        message: "Product Image Deleted Successfully",
      });
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
          message: "Error In Get Update Products API",
          error,
        });
    }
};

const deleteProductController = async (req, res) =>{
  try {
      const product = await productModel.findById(req.params.id);
      //Validation
      if(!product){
        return res.status(404).send({
          success: false,
          message: "Product Not Found"
        })
      }
      //Find And Delete Image From Cloudinary
      for(let index=0; index <product.images.length; index++){
        await cloudinary.v2.uploader.destroy(product.images[index].public_id)
      }
      await product.deleteOne();
      res.status(200).send({
        success: true,
        message: " Product Deleted Successfully"
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
        message: "Error In Get Delete Products API",
        error,
      });
  }
  }

  //Create Product Review And Comments

  const productReviewController = async (req, res) =>{
   try {
      const {comment, rating} = req.body;
      //Find Product
      const product = await productModel.findById(req.params.id)
      //Check Previous Review
      const alreadyReview = product.reviews.find( (r) => r.user.toString() === req.user_id.toString())
      if(alreadyReview){
        return res.status(404).send({
          success: false,
          message: "Product Already Review"
        })
      }
      //Review Object
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      }
      //Passing Review Object To Array
      product.reviews.push(review)
      //Number Or Reviews
      product.numReviews.length

      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
      //Save
      await product.save();
      res.status(200).send({
        success: true,
        message: "Review Added"
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
        message: "Error In Review Comments API",
        error,
      });
   }
  }
  //Get Top Products
  const getTopProductController = async (req, res) =>{
try {
  const products = await productModel.find({}).sort({rating:-1}).limit(3);
  res.status(200).send({
    success: true,
    message: "Top 3 Products",
    products,
  })
} catch (error) {
  console.log(error);
  res.status(500).send({
      success: false,
      message: "Error In Get Top Products API",
      error,
    });
}
  }
module.exports = 
{
    getAllProductController,
    getSingleProductController,
    createProductController,
    updateProductController,
    productImageUpdateController,
    deleteProductImageController,
    deleteProductController,
    productReviewController,
    getTopProductController
};