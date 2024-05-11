const express = require('express');
const{ registerControllers, loginController, getUserProfile, logOutController, updateProfileController, updatePasswordController, updateProfilePicController, passwordResetController } = require('../controllers/userControllers');
const isAuth = require('../middlewere/authMiddlewere');
const singleUpload = require('../middlewere/multer');
const rateLimit = require('express-rate-limit');

//Rate Limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
});

//Router Object

const router = express.Router();

//Routes

//Register
router.post('/register', limiter, registerControllers);
//LogIn
router.post('/login', limiter, loginController);

//Profile
router.get('/profile', isAuth, getUserProfile);

//LogOut
router.get("/logout", isAuth, logOutController);

//Profile Update
router.put("/profile-update", isAuth, updateProfileController);

//Update Password

router.put("/update-password", isAuth, updatePasswordController);

//Update Password

//router.put("/update-password", isAuth , updatePasswordController);

//Update ProfilePic

router.put("/update-picture", isAuth, singleUpload,  updateProfilePicController)

//Forgot Password
router.post("/reset-password", passwordResetController)
//Exports

module.exports= router;