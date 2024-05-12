import React, { useEffect, useState ,useRef} from 'react';
import '../App.css'
import { Navigate, useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import TodoHooks from '../hooks/TodoHooks';
import Loader from './Loader';
export default function TodoForm() {
    const [data, setData] = useState('');
    const [handlepostbox,setHandlePostBox]=useState(false);
    const [detailpanel,setdetailPanel]=useState(false);
    const [userdetail,setUserDetail]=useState({})
    const location=useLocation();
    const navigate = useNavigate();
    const {setTodoList}=TodoHooks()
    const usernameLOG=window.localStorage.getItem('userID');
 
    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(data);
  
        try {
            const response = await fetch('http://localhost:3004/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    username:usernameLOG,
                  
                    list: data })
            });
            if (!response.ok) {
                throw new Error('failed 404');
            }
            const result = await response.json();
          
            setTodoList(result);
        
            setData('');
            
        } catch (err) {
            console.log(err);
        }
    }
    const SignOutHandler=()=>{
        window.localStorage.removeItem('loginstatus');
        navigate('/',{state:{from:location}});
        window.location.reload();
    }
    const postBoxHandler=()=>{
        if(handlepostbox){
            setHandlePostBox(false)
        }else{
            setHandlePostBox(true);
            setdetailPanel(false)
        }
    }
    const DetailBoxHandler=()=>{
        if(detailpanel){
            setdetailPanel(false)
        }else{
            setdetailPanel(true)
            setHandlePostBox(false)
        }
    }

    const fetchDetail=async()=>{
       
        const response=await axios.get(`http://localhost:3004/user-detail/${usernameLOG}`);
        const result=await response.data;
        setUserDetail(result);
        return;
    }
 useEffect(()=>{
    fetchDetail();
 },[])
    return (
        <>
     
    <nav id='nav-container'>
    <div className='nav-btn-container'>
    <a href='/file-upload' ><button>UploadImage</button></a>
 {userdetail.role==='admin'? <a href='/list-of-user'><button>List of user</button></a>:""}
  <button onClick={()=>postBoxHandler()}>Check-Box</button>
  <button onClick={()=>DetailBoxHandler()}>Your Details</button>
  <button onClick={SignOutHandler}>SignOut</button>
    </div>
    </nav>
  {handlepostbox?    <div className='post-box-container'>
    <center><nav><span>Post Box</span></nav></center>
    <div>
       
    </div>
  </div>:""}
  {detailpanel?<div className='post-box-container'>
    <nav><center><span>Your Detail</span></center></nav>
    <p><b>User Name: </b>{userdetail.username}</p>
    <p><b>Role: </b>{userdetail.role}</p>
    <p><b>Joined:</b>{userdetail.date}</p>
  </div>:""}
            <h1>{usernameLOG}</h1>
          
           
            <form onSubmit={submitHandler}>
             
                <input value={data} onChange={(e) => setData(e.target.value)} className="input-field" required />
                <button type='submit' className='form-submit-btn' id="form-submit-btn">Submit</button>
                  
            </form>
         
        </>
    );
}
