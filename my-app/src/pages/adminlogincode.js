import React ,{useState,useContext}from "react";

import AdminLoginHook from "../hooks/AdminLoginHooks";
import {Navigate } from "react-router-dom";
import AdminRegister from "./admin-register";
import axios from 'axios'
export default function AdminLoginCode(){
    const [code,setCode]=useState('');
    const [result,setResult]=useState(false);
    const [showErr,setShowErr]=useState(false);
    const {codecheck,setCodeCheck}=AdminLoginHook();
    const codeHandler = async (e, code) => {
        e.preventDefault();
        const trimmedCode = code.trim();
        try {
            const response = await axios.post('http://localhost:3004/admin-login', {
                code: trimmedCode
            });
            if(response.status==200){
           
                    console.log('Response status is 200');
                    setCodeCheck({status:'ok'});
                    setShowErr(false);
              
            }else{
              
                throw new Error('incorrect');
            }
            const codeResult = await response.data;
            setResult(true)
            
    
            console.log('Response:', codeResult); // Log the response data
          
           
        } catch (err) {
            setCodeCheck('!ok')
            setShowErr(true);
            console.log('Error:', err);
        }
    };
    console.log(codecheck.status,'gg')
    return(<>
      {codecheck.status?<Navigate to='/admin-register' />:<>
            <form onSubmit={(e)=>codeHandler(e,code)}>
             Enter the code<input type="text" inputMode="numeric"  maxLength="7" value={code}onChange={(e)=>setCode(e.target.value)}/>
             {showErr?<span style={{color:'red'}}>Incorrect code</span>:""}
            <button type="submit">submit</button>
             </form>
        </>}
    </>)
}