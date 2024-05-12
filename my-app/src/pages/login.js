import React,{useState,useContext,useEffect,useRef} from "react";
import axios from "axios";
import {Navigate, useNavigate,useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth";
import "../Css/login.css"
import AuthHooks from "../hooks/AuthHooks";
export default function LoginHandler(){
    const navigate=useNavigate();
    const location=useLocation();
    const loginstatus=window.localStorage.getItem('loginstatus');
    const {auth,setAuth,ban,setBan}=AuthHooks();
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');

    const formHandler=async(e)=>{
        e.preventDefault();
        const formData=new FormData();
        formData.append('username',username);
        formData.append('password',password);
        try{
            const response=await axios.post('http://localhost:3004/login',formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            console.log(response.status)
            if(response.status!==200){
                throw new Error('failed to fetch');
            }
            const user=response?.data?.username;
            const role=response?.data?.role;
          
            setAuth({user,role})
            
            window.localStorage.setItem('loginstatus',true);
            window.localStorage.setItem('userID',user);
            window.localStorage.setItem('userRole',role);
            return user;
        }catch(err){
            console.log(err);
           
        }

    }

   
    
    return(
     
     <>
        {
        auth.user || loginstatus ?<Navigate to='/home' state={{ from: location, usernameLOG: username }} replace /> : (
            <div className="login-body">
                
            <form onSubmit={formHandler} className="form-container">
                <div className="input-box"><h3 style={{marginBottom:'25px',color:"whitesmoke",marginRight:'10px'}}>Username:</h3><input type="text" name='username' onChange={(e) => setUsername(e.target.value)} className="input-container"/></div>
                <div className="input-box"><h3 style={{marginBottom:'25px',color:"whitesmoke",marginRight:'10px'}}>Password:</h3><input type='password' name='password' onChange={(e) => setPassword(e.target.value)} className="input-container" /></div>
                <button type='submit' className="submit-btn">Submit</button>
            </form>
            </div>
        
        )
    }


        </>
    )
}