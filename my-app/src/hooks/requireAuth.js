import React, { useEffect } from "react";
import AuthHooks from "./AuthHooks";
import axios from "axios";
import BanPage from "../pages/BanPage";
import { Navigate,useNavigate, Outlet,useLocation} from "react-router-dom";
export default function RequireAuth(){
    const location=useLocation();
  
    const {auth,setAuth,ban,setBan,statuscheck}=AuthHooks();
    const loginstatus=window.localStorage.getItem('loginstatus');
    const userRole=window.localStorage.getItem('userRole');
    console.log(auth.user,"this is the user");
    const BanStatus=async()=>{
        const storedID=window.localStorage.getItem('userID');
        console.log(storedID,"this is the id");
        const response=await axios.get(`http://localhost:3004/user-ban-status/${storedID}`);
        const result=await  response.data;
        setBan({result});
        return result
    }
   useEffect(()=>{
    BanStatus();
   },[statuscheck])
    return auth.user || loginstatus?(ban.result? <Navigate to='/banned-user' />:<Outlet/>):<Navigate to='/' state={{from:location}} replace />
}