const express = require("express");
const isAuth = require("../middlewere/authMiddlewere");
const singleUpload = require("../middlewere/multer");
const { 
    createCategory,
    getAllCategoryController,
    deleteCategoryController,
    updateCategoryController
}
    = require("../controllers/categoryController");
const isAdmin = require("../middlewere/authMiddlewere");


const router = express.Router();

// ======= Category  Routes ========

// Create Category

router.post('/create', isAuth , isAdmin, createCategory);
// Get Category

router.get('/get-all',  getAllCategoryController);
// Delete Category

router.delete('/delete/:id', isAuth , isAdmin,  deleteCategoryController);

// Update Category

router.put('/update/:id', isAuth , isAdmin, updateCategoryController);


module.exports = router;