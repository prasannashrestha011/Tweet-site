import React ,{useState,useEffect} from 'react';
import FileHandler from './fileupload';

import axios from 'axios';
import { Buffer } from 'buffer';
import '../filePage.css'
export default function FilePage(){
    const[counter,setCounter]=useState(0);
    
    const [file,setFile]=useState('');
    const fetchFile=async()=>{
        try{
            const response=await axios.get('http://localhost:3004/list-file-data',{
            'Content-Type':'application/json'
        })
        if(response.status!=200){
            throw new Error( 'failed ');
        }
        const result=await response.data;
        const fileArray = result.map(file => {
            return {
                ID:file.ID,
                fileName: file.fileDetails.fileName,
                mimetype: file.fileDetails.mimetype,
                encodedFile: Buffer.from(file.fileDetails.encodedFile, '').toString(''),
            };
        });
       
        setFile(fileArray);
        return result;
        }catch(err){
                console.log(err);
            }
    }
    const DeleteMethod=async(index)=>{
            try{
                const response=await fetch(`http://localhost:3004/list-file/${index}`,{
                    method:'Delete',
        
                });
                if(!response.ok){
                    throw new Error('Error occured');
                }
                const result=await response.json();
                window.location.reload();
                console.log(result);
                return result;
            }catch(err){
                console.log(err);
            }
      
    }
    useEffect(()=>{fetchFile()},[])
    return(
        <>
        <h1>Upload your Image here</h1>
        <FileHandler/>
        <div className='file-container'>
        

          {file&&file.map((item,index)=>{
                return <>
                <button onClick={()=>DeleteMethod(item.ID)}>Delete</button>
                <div className='image-display-board'> 
                <h4>{item.ID}</h4>
                <img src={`data:${item.mimetype};base64,${item.encodedFile}` } className='image-display-board' />
                    <button onClick={()=>{
                        setCounter(counter+1)
                        console.log(counter);
                    }}>Like</button>

                </div>
                
                </>
            })}
        
        </div>
        </>
    )
}