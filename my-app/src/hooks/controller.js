import React,{useEffect, useState} from "react";
import AuthHooks from "./AuthHooks";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import axios from "axios";
export default function Controller() {
    const role = window.localStorage.getItem('userRole');
    const storedID=window.localStorage.getItem('userID');
    const [currentRole,setCurrentRole]=useState('');
    console.log(role);
    const navigate=useNavigate();
    const RoleStatus=async()=>{
        const response=await axios.get(`http://localhost:3004/user-detail/${storedID}`);
        const result=await response.data;
  
        setCurrentRole(result.role);
    }
    useEffect(()=>{
        RoleStatus();
    },[])
    return (
        currentRole=='admin'? <Outlet/>: <center>
                                        <h1>not authorized</h1>
                                        <a href='/home'><button>Go back</button></a>
                                        </center>
    );
}
