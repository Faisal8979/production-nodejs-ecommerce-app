const User = require("../models/userModels");
const getDataUri = require("../utills/features");
const cloudinary = require('cloudinary');

 const registerControllers = async(req, res) =>{
    try {
        const {name, email, password, address, city, country, phone, answer} = req.body;
        //Validation

        if(!name || !email || !password || !address || !city || !country || !phone || !answer){
            return res.status(500).send({
                success: false,
                message: "Please Provide All Fields"
            });

        }
        //Check Existing User

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(500).send({
                success:false,
                message:"Email Already Taken"
            })
        }
        const user = await User.create({
            name,
            email,
            password,
            address,
            city,
            country,
            phone,
            answer
        });
        res.status(201).send({
            success:true,
            message:"Registration Success !! Please Log In",
            user,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            meassage:'Error In Register API',
            error
        })
    }
}

const loginController = async (req, res) =>{
try {
    const {email, password} = req.body
    //Validation
    if(!email || !password){
        return res.status(500).send({
            success:false,
            message:'Please Add Email Or Password'
        })
    }
    //Check User
    const user = await User.findOne({email})
    //User Validation
    if(!user){
        return res.status(404).send({
            success:false,
            message:"User Not Found"
        })
    }
    //Check Password
    const isMatch = await user.comparePassword(password)
    //Validatio Password
    if(!isMatch){
        return res.status(500).send({
            success:false,
            message:'Invalid Credentials'
        })
    }

    //Token

    const token = user.generateToken();
    res.status(200).cookie("token", token,{
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure:process.env.NODE_ENV === "development" ? true : false,
        httpOnly:process.env.NODE_ENV === "development" ? true : false,
        sameSite:process.env.NODE_ENV === "development" ? true : false,
    }).send({
        success:true,
        message:'LogIn Successfully',
        token,
        user,
    })
} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:"Error In LogIn API"
    })
}
}

//Get User Profile

const getUserProfile = async (req, res) =>{
try {
    const user = await User.findById(req.user._id)
    user.password = undefined;
    res.status(200).send({
        success:true,
        message:'User Profile Fetch Successfully..',
        user,
    })
} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error In Profile API',
        error,
    })
}
}

const logOutController = async (req, res) =>{
 try {
 
    res.status(200).cookie("token", " ",{
        expires: new Date(Date.now()),
        secure:process.env.NODE_ENV === "development" ? true : false,
        httpOnly:process.env.NODE_ENV === "development" ? true : false,
        sameSite:process.env.NODE_ENV === "development" ? true : false,
    }).send({
        success:true,
        message:"LogOut Successfull..",
    })
 } catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: 'Error In LogOut API'
    })
 }
}

//Update profile

const updateProfileController = async (req, res) =>{
 try {
    const user = await User.findById(req.user._id)
    const {name, email, address, city, country, phone,role} = req.body;
   //Validation + Update
 if(name) user.name = name;
 if(email) user.email = email;
 if(address) user.address = address;
 if(city) user.city = city;
 if(country) user.country = country;
 if(phone) user.phone = phone;
 if(role) user.role = role; 

  //User Save
    await user.save();
    res.status(200).send({
        success:true,
        message:"User Update SuccessFull.."
    })

 } catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: 'Error In Update API',
        error
    })
 }
}

//Update Password

const updatePasswordController = async (req, res) =>{
try {
    const user = await User.findById(req.user._id)
    const { oldPassword, newPassword } = req.body;
    
    //Validation
    if(!oldPassword || !newPassword){
        return res.status(500).send({
            success:false,
            message:"Please Provide Old And New Password"
        })
    }

    //Old Password Check

    const isMatch = await user.comparePassword(oldPassword);

    //Validation

    if(!isMatch){
        return res.status(500).send({
            success:false,
            message:"Invalid Old Password"
        })
    }
    user.password = newPassword;

    await user.save();

    return res.status(200).send({
        success:true,
        message:"Password Updated Successfully"
    })

} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: 'Error In Password API',
        error
    })}
};

//Update User Profile Photo

const updateProfilePicController = async (req, res) =>{
try {
    const user = await User.findById(req.user._id)

    //Get File From User

    const file = getDataUri(req.file)
    
    //Delete Previous Image

   //  await cloudinary.v2.uploader.destroy(user.profilePic.public_id)

    //Update Profile Pic 

    const cdb = await cloudinary.v2.uploader.upload(file.content)
    user.profilePic = {
        public_id: cdb.public_id,
        url: cdb.secure_url
    }

    //Save Function

    await user.save();
    res.status(200).send({
        success:true,
        message:"Profile Picture Updated"
    })
} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: 'Error In Profile Pic Update API',
        error
    })
}
}
//Forgot Password

const passwordResetController = async(req, res) =>{
  try {
    //User Get Email || newPassword || Answer

    const {email, newPassword, answer} = req.body;
    //Validation
    if(!email || !newPassword || !answer){
        return res.status(500).send({
            success: false,
            message: "Please Provide All Fields"
        })
    }
    //Find User || Find Answer
    const user = await User.findOne({email, answer})
    //Validation
    if(!user){
        return res.status(404).send({
            success: false,
            message: "User Not Found"
        })
    }
    user.password = newPassword
    await user.save();
    res.status(200).send({
     success: true,
     message:"Your Password Has Been Reset Please LogIn"
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: 'Error In Profile Pic Update API',
        error
    })
  }
}

module.exports = 
{
   registerControllers,
   loginController,
   getUserProfile,
   logOutController,
   updateProfileController,
   updatePasswordController,
   updateProfilePicController,
   passwordResetController
    };