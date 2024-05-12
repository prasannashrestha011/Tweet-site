import React,{useState,useContext} from "react";
import AdminLoginHook from "../hooks/AdminLoginHooks";
import {Outlet,Navigate} from 'react-router-dom'
export default function RequireAdminCode(){
    const {codecheck}=AdminLoginHook();
    console.log(codecheck,"is the true or false")
    return codecheck?.status=='ok'?<Outlet/>:<Navigate to='/admin-login-code' />
}