import React from "react";
import { useNavigate } from "react-router-dom";
export default function BanPage(){
    const navigate=useNavigate();
    const signoutHandler=()=>{
   
     
        window.localStorage.removeItem('loginstatus');
        navigate('/')
    }
    return(
       <>
        <center>You are Banned from the server!!</center>
        <center><button onClick={signoutHandler}>SignOut</button></center>
       </>
    )
}