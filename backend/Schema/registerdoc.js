const mongoose=require('mongoose');
const userDoc=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
    },
    ban:{
        type:Boolean,
        default:false,
    },
    date:{
        type:String,
    },
    profileImg:{
        fileName:String,
        fileType:String,
        encodedFile:Buffer
    }
    
})
module.exports=mongoose.model('Users',userDoc);