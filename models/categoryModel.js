const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({

    category:{
        type: String,
        required: [true, "Product Category Is Required"]
    },
},
{
    timestamps: true
});

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;