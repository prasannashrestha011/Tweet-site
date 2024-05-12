const express=require('express');
const cors = require('cors');
const app=express();
const session=require('express-session');


app.use(express.json());
app.use(cors()); // Use cors middleware to allow all origins



const passport=require('passport');
const Strategy=require('passport-local');
    require('../authentication/authentication.js');
 app.use(session({
 secret: 'coder-session',
  resave: false,
saveUninitialized: false
      }));
app.use(passport.initialize());
app.use(passport.session());

const multer=require('multer');

const upload=multer({storage:multer.memoryStorage()});
const {createPool}=require('mysql');
const pool=createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'transactions'
})
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/todolist').then(()=>console.log('Connected to the database')).catch((err)=>console.log(err))
const userData=require('../Schema/Schema.js'); //all users uploaded list
const fileData=require('../Schema/file.js');
const users=require('../Schema/registerdoc.js'); //registered users
const userRecord=require('../Schema/userrecord.js'); // each user records
const BanStatus=require('../Schema/banStatus.js');//Checks Ban Status for each user
const adminLoginCode={
    code:"976554"
}
//hashing
const {hash}=require('../hashing/hash.js');
const PORT=3004;

app.get('/',(req,res)=>{
    res.send('welcome')
})

app.post('/register',upload.single('profileImg'),async(req,res)=>{
    console.log(req.body);
    const profileImg=req.file;
    const {username,password,role,Date}=req.body;
    const userDetail= new users({
        username:username,
        password:await hash(password),
        role:role,
        date:Date,
        profileImg:{
            fileName:profileImg.originalname,
            fileType:profileImg.mimetype,
            encodedFile:profileImg.buffer.toString('base64')

        }
    })
    const savedUser=await userDetail.save();
    console.log(savedUser);
    res.json(savedUser);
});
app.get('/user-data/',async(req,res)=>{
    console.log('function  is running')
    const {username}=req.body;
    const findUser=await users.findOne({username:username});
    console.log('data send')
    res.json(findUser);
})
app.post('/login', upload.none(), passport.authenticate('local'), async(req, res) => {

    const username = req.body.username;
    const findUser=await users.findOne({username:username})
    console.log('correct')
  
    res.json(findUser);
});
app.get('/list-of-users',async(req,res)=>{
    const listOfUsers=await  users.find({}).lean();
    const userDetails=listOfUsers.map((user)=>{
        const users={
            username:user.username,
            role:user.role,
            ban:user.ban,
            date:user.date
        }
        return users;
    })
    res.json(userDetails);
})
app.get('/user-detail/:username',async(req,res)=>{
    const {username}=req.params;
    try{
        const findUser=await users.findOne({username:username});
        console.log('userdetail send');
        res.json(findUser);
    }catch(err){
        console.log(err)
    }
       
})
app.get('/user-ban-status/:username',async(req,res)=>{
    const {username}=req.params;
    const findUser=await users.findOne({username:username});
    console.log(username,"=",findUser.ban)
    res.send(findUser.ban);
})
app.patch('/list-of-users/:username',async(req,res)=>{
    const {username}=req.params;
    const {ban}=req.body;
    if(typeof ban !=='boolean') return res.status(400).send({message:'Invalid ban value.It must be in a boolean type'})
    try{
     
        const updateUser=await users.updateOne({username:username},{$set:{ban:ban}})
        console.log('status updated');
        res.sendStatus(200);
    }catch(err){
        console.log(err);
    }
})
app.patch('/assign-user-role/:username',async(req,res)=>{
    const {username}=req.params;
    const {role}=req.body;
    const updateRole=await users.updateOne({username:username},{$set:{role:role}});
    res.send('roleUpdated');
})
app.delete('/list-of-users/:username',async(req,res)=>{
    const {username}=req.params
    const targetedUser=await users.deleteOne({username:username});
    console.log(targetedUser,"was just deleted");
    res.send('user deleted');
})

app.get('/user-role/:username',async(req,res)=>{
    const {username}=req.params;
    console.log(username)
    const findUser=await users.findOne({username:username}).lean();;
        if(!findUser) return console.log('username not found');
        console.log(findUser);
    res.json(findUser);
})

app.get('/list',(req,res)=>{
    res.send('Here is your list')
})
app.get('/list-data',async(req,res)=>{
    const userRecord=await userData.find({}).sort({_id:-1});
       
    res.json(userRecord);
})
app.get('/list-data-app',async(req,res)=>{
    const userRecord=await userData.find({}).sort({_id:-1});
    const updatedRecord=userRecord.map((item)=>{
        return{
            userName:item.userName,
            userID:item.userID,
            role:item.role,
            list:item.list,
            like:item.like,
            comment:item.comment
        }
    })
   
    res.json(updatedRecord);
})
app.post('/list',async(req,res)=>{
    const {username,list}=req.body;
    const findUser=await users.findOne({username:username});

    var genID=Math.ceil(Math.random()*1000)
    const userInfo=new userData({
        userName:findUser.username,
        role:findUser.role,
        userID:genID,
        list:list,
        profileImg:{
            fileName:findUser.profileImg.fileName,
            fileType:findUser.profileImg.fileType,
            encodedFile:findUser.profileImg.encodedFile
        }
    })
    const existingUser=await userRecord.findOne({userName:username}).exec();
    if(!existingUser){
        const userRecords=new userRecord({
            userName:username,
            userData:[
                {
                    ID:genID,
                    list:list,
                }
            ]
        })
       await userRecords.save();
        
     
    }else{
        existingUser.userData.push({ID:genID,list:list});
        await existingUser.save();
      
       
    }
    const savedInfo=await userInfo.save();
        console.log(savedInfo,"to do list ::::");
        res.json(savedInfo);
})
app.patch('/list', async (req, res) => {
    const { userID, username } = req.body;
    const findList = await userData.findOne({ userID: userID });

    if (!findList) {
        return res.status(404).json({ message: 'User not found' });
    }

    const likeStatus = findList.like.get(username);

    try {
        if (likeStatus) {
            findList.like.delete(username);
        } else {
            findList.like.set(username, true); 
        }
        
        await findList.save();
        console.log(findList.like.size);
        res.send('Liked');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.patch('/comment/:userID',async(req,res)=>{
    const {userID}=req.params;
    const {username,comment}=req.body;
    const commentUserID=Math.ceil(Math.random()*1000)
    const commentID=Math.ceil(Math.random()*1000)
    console.log(username,comment)
    const findList=await userData.findOne({userID:userID});
        findList.comment.set(`${username}-${commentUserID}`,{content:comment,id:commentID});
        await findList.save();
        res.sendStatus(200)
   
    
})

app.patch('/comment/user-delete/:userID/:index',async(req,res)=>{
    const {userID,index}=req.params;
    const {username}=req.body;
    const findList=await userData.findOne({userID:userID});
    const userComment=findList.comment.get(username);
    const comments=userComment.split('\n');

    try{
        comments.splice(index,1)
        findList.comment.set(username,comments.join('\n'))
        await findList.save();
        console.log('comment deleted');
        res.sendStatus(200)
    }catch(err){
        console.log(err)
        res.sendStatus(400)
    }
})

app.get('/likes/:userID',async(req,res)=>{
    const {userID}=req.params;
    const findUser=await userData.findOne({userID:userID});
    const likecount=findUser.like.size;
    res.json({likecount});
})



app.put('/list-data/:index',async(req,res)=>{
    const {index}=req.params;
    const {newList}=req.body;
    console.log(req.body)
    try{
        const userRecord=await userData.findOne({userID:index});
        userRecord.list=newList;
        const savedRecord=await userRecord.save();
        console.log('data modified');
        res.json(userRecord);
    }catch(err){
        console.log('failed ',err);
    }
})
app.delete('/list-data/:index',async(req,res)=>{
    const {index}=req.params;
    try{
        const userRecord=await userData.findOne({userID:index});
        if(!userRecord){
            throw new Error("user not found 404");
        }
        await userRecord.deleteOne({userID:index});
        res.json(200);
    }catch(err){
        console.log(err);
    }
})
app.post('/list-file',upload.single('filebase64'),async(req,res)=>{
    const filedetails=req.file;
    console.log(filedetails);
    const savedFile=new fileData({
        ID:Math.ceil(Math.random()*1000),
        fileDetails:{
            fileName:filedetails.originalname,
            mimetype:filedetails.mimetype,
            encodedFile:filedetails.buffer.toString('base64'),
        }

    })
    await savedFile.save();
    console.log(savedFile,"fileSaved::::");
    res.json(200);
})
app.delete('/list-file/:index',async(req,res)=>{
    const {index}=req.params;
    const fileRecord=await fileData.deleteOne({ID:index});
    res.json(200);
})
app.get('/list-file-data',async(req,res)=>{
    const fileRecord=await fileData.find({});
    console.log(fileRecord);
    res.json(fileRecord);
})
app.get('/transactions-data',(req,res)=>{
    pool.query('SELECT * FROM transactions_table',(err,result)=>{
        if(err) return console.log(err)
        res.send(result);
    })
})

app.post('/transactions-data',upload.none(),(req,res)=>{
    const {transaction_name,transaction_amount}=req.body;
    pool.query('INSERT INTO transactions_table (transaction_name,transaction_amount) VALUES(?,?)',[transaction_name,transaction_amount],(err,result)=>{
        if(err) return console.log('Error occured',err);
        console.log('data send');
        res.sendStatus(200);
    })
})
app.delete('/transactions-data/:transaction_id',(req,res)=>{
    const {transaction_id}=req.params;
    pool.query('DELETE FROM transactions_table WHERE transaction_id=?',[transaction_id],(err,result)=>{
        if(err) return console.log('failed to delete data from the database');
        res.send('data deleted from the database');
    })
})
app.post('/admin-login',(req,res)=>{
    const {code}=req.body
    console.log(code)
    console.log(adminLoginCode)
  
        if(code==adminLoginCode.code){
            console.log('correct');
            res.sendStatus(200);
        }else{
                console.log('incorrect')
                res.sendStatus(400);
        }
    
})
app.listen(PORT,()=>{
    console.log(`Server has been executed on ${PORT}`);
})