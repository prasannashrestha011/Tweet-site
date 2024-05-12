import React,{useEffect,useState,useContext} from "react";
import axios from 'axios';
import '../App.css'
import { NameContext } from "../App";
export default function FileHandler(){
    const value=useContext(NameContext)
    const [file,setFile]=useState('');
    const PostFile=async(e)=>{
        e.preventDefault();
        const formData=new FormData();
        console.log(file);
        if (!file) {
            console.error("No file selected");
            return;
          }
        formData.append('filebase64',file);
       console.log(formData)
        try{
            
            const response=axios.post('http://localhost:3004/list-file',
            formData,
            {
                'Content-Type':'multipart/form-data'
            }
            )
              if(response.status!=200){
                throw new Error('failed');
              }
              const result=await response.data;
              
              return result;
        }catch(err){
            console.log(err);
        }
    
    }
    return(
        <>
        <div className="file-input-field">

            <form encType="multipart/form-data" onSubmit={PostFile}>
                <label for="file-input-field">
                <img src='/assets/upload-icon.png' class='upload-font-img' id="upload-btn"/>  
                </label>
                <input type='file' id="file-input-field" name="filebase64" onChange={(e)=>{setFile(e.target.files[0]) }} required/>
                <button type="submit" id='form-submit-btn-file' onClick={()=>window.location.reload()} >Upload</button>
            </form>
        </div>
        </>
    )
}