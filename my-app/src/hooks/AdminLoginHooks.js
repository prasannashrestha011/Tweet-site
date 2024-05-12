import React,{useContext} from "react";
import { AdminLoginContext } from "../context/adminlogincontext";
export default function AdminLoginHook(){
    return (
        useContext(AdminLoginContext)
    )
}