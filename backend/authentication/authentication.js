const passport=require('passport');
const Strategy=require('passport-local');
const database=require('../Schema/registerdoc');
const {comparePassword}=require('../hashing/hash.js');
passport.use(new Strategy(async(username,password,done)=>{
        console.log(username,password)
    try{
        const findUser= await database.findOne({username:username});
        if(!findUser) throw new Error('User not FOUND 404');
        if(!comparePassword(password,findUser.password)) throw new Error('Invalid password');
        done(null,findUser)
    }catch(err){
        console.log(err);
        done(err,null)
    }
}
))
passport.serializeUser((user,done)=>{
   
    done(null,user.id);
})
passport.deserializeUser((id,done)=>{

    try{
        const findUser=database.findById(id);
        if(!findUser) throw new Error("User not found 404");
        done(null,findUser);
    }catch(err){
        console.log(err)
        done(err,null);
    }
})