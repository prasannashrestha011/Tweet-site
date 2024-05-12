import React ,{useState,useContext}from "react";
import axios from "axios";
const monthNames=[ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"]
const dayNames=[ "Sunday", "Monday", "Tuesday", "Wednesday",
"Thursday", "Friday", "Saturday"]
export default function AdminRegister(){

    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [profileImg,setProfileImg]=useState('');
    const [role,setRole]=useState('');
    // registerd details
    const now = new Date();
    const year=now.getFullYear();
    const month=now.getMonth();
    const day=now.getDay();
    let hours=now.getHours();
    // determines Am or Pm
    const minutes=now.getMinutes();
    const ampm=hours>=12?'PM':'AM';
    hours=hours%12;
    const MonthIndex=monthNames[month];
    const DayIndex=dayNames[day];
    console.log('Joined on',year,MonthIndex,DayIndex,hours,ampm);
       // registerd details
    const formHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('role',role);
        formData.append('Date', `${year}-${MonthIndex}-${DayIndex} ${hours}:${minutes} ${ampm}`);
        formData.append('profileImg',profileImg);
        
        console.log("Form Data:", formData);
        
          
        try {
            const response = await axios.post('http://localhost:3004/register',formData,{

            headers: {
                'Content-Type': 'multipart/form-data'
            }
            });
    
            if (response.status !== 200) {
                throw new Error('bad request');
            }
    
            const result = response.data;
            console.log(result.username,'is your user');
            alert('Account created');
            return result;
        } catch (err) {
            console.log(err);
        }
    };
    
    
    return(
        <>

        <form onSubmit={formHandler}>
        Username:<input type='text' name='username' onChange={(e)=>setUsername(e.target.value)}/>
        Password<input type='text' name='password' onChange={(e)=>setPassword(e.target.value)}/>
        Choose your role:<select onChange={(e)=>setRole(e.target.value)}>
            <option value=''>Select</option>
            <option value='admin'>Admin</option>
            <option value='editor'>Editor</option>
           
        </select>
        <input type='file' onChange={(e)=>setProfileImg(e.target.files[0])}/>
        <button type="submit">Submit</button>
        </form>
        </>
    )
}