const jwt = require('jsonwebtoken');
const User = require('../models/userModels');


//User Auth
const isAuth = async(req, res, next) =>{
const { token } = req.cookies;
//Validation
if(!token){
    return res.status(500).send({
        success: false,
        message: 'Unautorized User'
    })
}
const decodeData = jwt.verify(token, process.env.SECRET_KEY)
req.user = await User.findById(decodeData._id);
next();
}
module.exports = isAuth;

//ADMIN AUTH

// const isAdmin = async (req, res, next) => {
//   const user = req.body;
//     if (user.role !== "admin") {
//         return res.status(401).send({
//           success: false,
//           message: "Admin only",
//         });
//       }
//     next();
//   };
// module.exports = isAdmin;