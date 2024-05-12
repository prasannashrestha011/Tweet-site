const mongoose=require('mongoose');
const userRecord=mongoose.Schema({
    userName:{
        type:String,

    },
    userData:[{
        ID:{
            type:Number
        },
        list:{
            type:String,
        }
    }]
})
module.exports=mongoose.model('user record',userRecord);