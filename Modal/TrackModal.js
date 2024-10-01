const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
    id:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    info:{
        type:String, 
        required:true,
    },
    date:{
        type:Date, 
        required:true,
    }
});

const Track = mongoose.model('Track', trackSchema); 
module.exports = Track; 
