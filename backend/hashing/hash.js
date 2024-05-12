const bcrypt=require('bcrypt');
const saltrounds=10;
const hash=async(password)=>{
    const salt=await bcrypt.genSalt(saltrounds);
    return bcrypt.hash(password,salt);
}
const comparePassword=(plain,hashed)=>{
    return  bcrypt.compareSync(plain,hashed);
}
module.exports={hash,comparePassword};