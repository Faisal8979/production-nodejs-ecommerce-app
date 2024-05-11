const TestControllers = require("../controllers/TestControllers");

const express = require("express");

//Router Object

const router = express.Router();

//Routes
router.get('/test' , TestControllers);

module.exports = router;