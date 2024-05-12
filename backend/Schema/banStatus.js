const mongoose=require('mongoose');
const BanStatus=mongoose.Schema({
    username:{
        type:String,
        unique:true,
    },
    role:{
        type:String,
    },
    ban:{
        type:Boolean,
    }
})
module.exports=mongoose.model('BanStatus',BanStatus);