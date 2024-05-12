const mongoose=require('mongoose');
const userData=mongoose.Schema({
    userName:{
        type:String,
    },
    userID:{
        type:Number,
      
    },
    role:{
        type:String
    },
    list:{
      
        type:String,
        
    },
    profileImg:{
        fileName:String,
        fileType:String,
        encodedFile:Buffer
    },
    like: {
        type: Map,
        of: Boolean,
        default: {}
    },
    comment:{
        type:Map,
        of:{content:String,id:Number},
        default:{}
    }
        
       
    

})
module.exports=mongoose.model('todolists',userData);