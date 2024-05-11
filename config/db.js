const mongoose = require('mongoose');
const colors = require('colors');

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log(`Connection Successfull ${mongoose.connection.host}`.bgBlue.red);
})
.catch(()=>{
    console.log(`No Connection`.bgRed.white);
})
