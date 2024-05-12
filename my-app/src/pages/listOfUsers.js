import React ,{useState,useEffect}from "react";
import axios from "axios";
import '../Css/listOfusers.css'
import AuthHooks from "../hooks/AuthHooks";
import Loader from "../components/Loader";
export default function FetchRegUser(){
    const [userlist,setUserlist]=useState([]);
    const [hidepanel,setHidepanel]=useState(false);
    const [isLoading,setIsLoading]=useState(false);
    const [currentindex,setCurrentIndex]=useState('');
    const {setStatusCheck}=AuthHooks();
    const [selectrole,setSelectRole]=useState('');
   
    const now = new Date();

    const listOfUsers=async(e)=>{
     
        try{
            const response=await fetch('http://localhost:3004/list-of-users',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            if(!response.ok) throw new Error("failed to fetch the route")
            const dataList= await response.json();
            setUserlist(dataList);
            console.log(userlist);
            setIsLoading(false)
            return
        }catch(err){
            console.log(err);
        }
        
    }
    const deleteUser=async(username)=>{
        const response=await axios.delete(`http://localhost:3004/list-of-users/${username}`);
        const result=await response.data;
        console.log(result);
        listOfUsers();
        return result;
    }
    const banUser=async(username,status)=>{
        const response=await axios.patch(`http://localhost:3004/list-of-users/${username}`,{
            ban:status,
        })
        const result=await response.data;
        setStatusCheck({result})
        listOfUsers();
        console.log(result," is received from the server");
       
        return
    }
    const roleHandler=async(username,role)=>{
        setCurrentIndex(username);
   
    }
  const assignRole=async(e,username,role)=>{
    e.preventDefault();
    const response=await axios.patch(`http://localhost:3004/assign-user-role/${username}`,{
        role:role,
    })
    listOfUsers();
    const result=await response.data;

   
    console.log(result);

    return result;
  }
    useEffect(()=>{
        setIsLoading(true);
        listOfUsers();
       
    },[])
    return(
      <>
       
       {isLoading?<Loader/>:""}
        <main>
      
         <ul className="list-of-users">
         {userlist.map((item,index)=>{
             return <li key={index}>
                 <div className="list-user-container">
             <h1>
                 <div className="list-header-detail">
                     {item.username}/{item.role=='admin'?<span style={{color:'Yellow'}}>{item.role}</span>:<span>{item.role}</span>}/{item.ban?<span className='code-red'  >{item.ban.toString()}</span>:<span className='code-blue'>{item.ban.toString()}</span>}
                 </div>
             </h1>
                 <div className="date-details"><span>Joined on {item.date}</span></div>
                 {/*  buttons div*/}
                 <div className="btn-container">
                 <button onClick={()=>deleteUser(item.username)} className="lists-btns-before">Delete</button>
             {item.ban?<button onClick={()=>banUser(item.username,false)} className="lists-btns-after">Unban</button>:<button onClick={()=>banUser(item.username,true)} className="lists-btns-before">Ban</button>}
             <button onClick={()=>{
                 if(hidepanel){
                     setHidepanel(false)
                 }else{
                     setHidepanel(true)
                 }
                 roleHandler(item.username)
             }}>Edit Role</button>
                 </div>
             </div>
             {hidepanel&&currentindex==item.username?<>
                 <form onSubmit={(e)=>assignRole(e,item.username,selectrole)}>
                 <select onChange={(e)=>setSelectRole(e.target.value)}>
                 <option value=''>select role</option>
                 <option value="admin">Admin</option>
                 <option value='editor'>Editor</option>
                 <option value='member'>Member</option>
             </select>
             <button type="submit">Submit</button>
                 </form>
             </>:""}
             </li>
         })}
        
         </ul>
     </main>
       
      </>
    )
}
