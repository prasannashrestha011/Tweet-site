const mongoose=require('mongoose');
const fileData=mongoose.Schema({
    ID:{
        type:String,
    },
    fileDetails:{
        fileName:String,
        mimetype:String,
        encodedFile:Buffer,
    }
})
module.exports=mongoose.model('fileData',fileData)