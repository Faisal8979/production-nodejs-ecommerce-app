const categoryModel = require('../models/categoryModel');
const productModel = require('../models/productsModel');

// CREATE Category
const createCategory = async (req, res) =>{
try {
    const { category} = req.body;
    if(!category){
        return res.status(404).send({
            success: false,
            message: " Please Provide Category Name"
        })
    }
    await categoryModel.create({category})
    res.status(200).send({
        success: true,
        message : `${category} Category Created Successfully`
    })
} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "Error In Create Category API"
    })
}
}
const getAllCategoryController = async (req, res) =>{
     try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "Categories Fetch Successfully",
            TotalCategory : category.length,
            category,
        })
     } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Get All Category API"
        })
     }
}

//DELETE Category

const deleteCategoryController = async (req, res) =>{
    try {
        const category = await categoryModel.findById(req.params.id);
        //Validation
        if(!category){
            return res.status(404).send({
                success: false,
                message: "Category Not Found"
            })
        }
        //Find Product With This Category Id

        const product = await productModel.find({category:category._id})
        //Update Product Category
        for(let i=0; i < product.length; i++){
            const products = product[1]
            products.category = undefined;
            await product.save(); 
        }
        await category.deleteOne();
        res.status(200).send({
            success: true,
            message: "Catetgory Deleted Successfully"
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
            message: "Error In Delete Category API",
            error,
          });
    }
}
//UPDATE Category
const updateCategoryController = async (req, res) =>{
    try {
        const category = await categoryModel.findById(req.params.id);
        //Validation
        if(!category){
            return res.status(404).send({
                success: false,
                message: "Category Not Found"
            })
        }

        //Get New Catetgory
        const {updateCategory} = req.body;
        //Find Product With This Category Id

        const product = await productModel.find({category:category._id})
        //Update Product Category
        for(let i=0; i < product.length; i++){
            const products = product[1]
            products.category = updateCategory;
            await product.save(); 
        }
        if (updateCategory) category.category = updateCategory;
        await category.save();
        res.status(200).send({
            success: true,
            message: "Catetgory Updated Successfully"
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
            message: "Error In Update Category API",
            error,
          });
    }
}

module.exports = {
    createCategory,
    getAllCategoryController,
    deleteCategoryController,
    updateCategoryController
}