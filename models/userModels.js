const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
name:{
    type: String,
    required :[true, "Name Is Required"],
},
email:{
    type: String,
    required: [true, "Email Is Required"],
    unique:[true, "Email Is Already Taken"]
},
password:{
    type:String,
    required:[true, "Password Is Required"],
    minLength:[6, "Password Length Should Be Greater Then 6 Character"],
},
address:{
    type:String,
    required:[true, 'Address Is Required']
},
city:{
    type: String,
    required:[true, "City Is Required"]
},
country:{
    type: String,
    required:[true, "Country Name Is Required"]
},
phone:{
    type: String,
    required:[true, "Phone No. Is Required"]
},
profilePic:{
    public_id: {
        type: String,
    },
    url: {
        type: String,
    },
},
answer:{
type: String,
required: [true, "Answer Is Required"]
},
role :{
    type : String,
    default : 'user'
}

}, {timestamps:true});

//Functions 
//Hash Function

userSchema.pre("save", async function( next ){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
});

//Compare Function 
userSchema.methods.comparePassword = async function(plainPassword){
    return await bcrypt.compare(plainPassword, this.password)
};

//Token Generate

userSchema.methods.generateToken = function(){
    return jwt.sign({_id: this._id}, process.env.SECRET_KEY,{
        expiresIn: "7d",
    }); 
};


const User = mongoose.model("user" ,userSchema);

module.exports= User;