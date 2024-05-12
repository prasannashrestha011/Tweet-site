import React,{useEffect,useState} from "react";
import TodoHooks from '../hooks/TodoHooks';
import '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as solidThumbsUp ,faXmark} from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumbsUp} from '@fortawesome/free-regular-svg-icons';
import { Buffer } from "buffer";
import Loader from "./Loader";
import PostLoader from "./postloader";
import axios from 'axios'

export default function List({data}){
    const usernameLOG=window.localStorage.getItem('userID');
    const [listdata,setListData]=useState([]);
    const [edited,setEdited]=useState(false);
    const [editedvalue,setEditedValue]=useState('');
    const [currentindex,setCurrentIndex]=useState('');
    const [showuserlikes,setShowUserLikes]=useState(false);
    const [shownavbuttons,setShowNavButtons]=useState(false);
    const [showcommentpanel,setShowCommentPanel]=useState(false);
    const [likedpanel,setLikedPanel]=useState('');
    const [commentpanel,setCommentPanel]=useState('');
    const [commentdata,setCommentData]=useState('');
    const {todolist,setTodoList}=TodoHooks();
    const [isLoading,setIsLoading]=useState(false);
    const [postloader,setPostLoader]=useState(false);
 
        console.log(todolist,"is the funciton envoked");
    const Listrecord=async()=>{
        try{
            const response=await fetch('http://localhost:3004/list-data',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            if(!response.ok){
                throw new Error('Failed ');
            }
            const result=await response.json();
        
           const updatedData=result.map(item=>{
            const base64String=Buffer.from(item.profileImg.encodedFile,'').toString('')
            return{...item,profileImg:{...item.profileImg,encodedFile:base64String}}
           })
            console.log("this is the updated data",updatedData)
            setListData(updatedData);
           
            setIsLoading(false);
            setPostLoader(false);
            return result;
        }catch(err){
            console.log(err);
        }
    }
    const PutMethod=async(e,index)=>{
        e.preventDefault();
           console.log(editedvalue);
            
        const response= await fetch(`http://localhost:3004/list-data/${index}`,{
            method:'PUT',
            headers:{
              'Content-Type':'application/json'  
            },
            body:JSON.stringify({newList:editedvalue}),

        })
        const result= await response.json();
        Listrecord();
      
        setPostLoader(true)
        setEdited(false);
        return result;
    }
    const DeleteMethod=async(index,role)=>{
      
            try{
                const response=await fetch(`http://localhost:3004/list-data/${index}`,{
                    method:"Delete",
                })
                if(!response.ok){
                    throw new Error('network failed 400');
                }
                const result= await response.json();
                console.log(result);
                setIsLoading(true);
                Listrecord();
                return result
            }catch(err){
                console.log(err);
            }
        }
    const likeHandler=async(userID,username)=>{
        console.log(userID,username)
       try{
        const response=await axios.patch('http://localhost:3004/list',{userID:userID,username:username});
        if(response.status!=200) throw new Error ('failed to fetch the route');
            console.log('you liked the post');
            Listrecord();
            return;
       }catch(err){
            console.log(err)
       }
    }
    const commentHandler=async(e,userID,username,comment)=>{
        e.preventDefault();
        try{
            const response=await axios.patch(`http://localhost:3004/comment/${userID}`,{
                username:username,
                comment:comment
            });
            const result=await response.data;
           
            setCommentData('')
        
            Listrecord();
            return;
        }catch(err){
            console.log(err)
        }
    
    }
    useEffect(()=>{
  
        setIsLoading(true)
       
        Listrecord();
    },[todolist]);

    return(
        <>
        
          <h1 className='header-list'>List data</h1>
          <ul className={`list-container ${isLoading?'loading':""}`}>
          {isLoading?  <div style={{position:'absolute',left:'50%',top:'60%'}}><Loader/></div>:""}
          <div className="display-holder">
            {listdata.map((item,index)=>{
          
                return   <li key={index} className={`list-data ${postloader&&currentindex==item.userID?'loading':''}`} >
                                  
                                    <div className="user-detail">{/* user details */}
                                <div className="user-detail-header">
                                   <div className="user-detail-header-user-info">
                                    <img src={`data:${item.profileImg.mimitype};base64,${item.profileImg.encodedFile}`} alt="profileImage" className="user-detail-profile-img"/>
                                    <h3>{item.userName}/{item.role}</h3>
                                    </div>
                                  {item.userName==usernameLOG?<>
                                    <button onClick={()=>{
                                    if(shownavbuttons){
                                        setShowNavButtons(false)
                                    }else{
                                        setShowNavButtons(true)
                                    }
                                }}><b>:::</b></button>
                                  </>:""}
                                </div>
                            <h3 className="list-content">
                            {item.list}
                            </h3>
                            {/*edit input panel */}
                                {edited&&item.userID==currentindex?(<>
                                        <form onSubmit={(e)=>PutMethod(e,item.userID)}>
                                        <input type='text' value={editedvalue} onChange={(e)=>setEditedValue(e.target.value)} required />
                                        <button type="submit">Done</button>
                                        </form>
                                </>):""}
                    {/*edit input panel */}

                                </div>{/* user details */}

                            {showuserlikes&&likedpanel==item.userID?<div className="liked_users_name">
                                <button onClick={()=>setShowUserLikes(false)}><FontAwesomeIcon icon={faXmark} /></button>
                            {Object.keys(item.like).map((likeUser, likeIndex) => (
                                            
                                            <span key={likeIndex}>{likeUser}</span>
                                        ))}
                            </div>:""}
                        {postloader&&item.userID==currentindex?<div style={{width:'20px',position:'relative',left:'45%',top:'-30px'}}><PostLoader/></div>:""}
                            <div className="font-container"> 
                                <div className='like-container' title="view likes">      
                            
                                {item.like.hasOwnProperty(usernameLOG)?
                                <button onClick={()=>likeHandler(item.userID,usernameLOG)}>
                                        <FontAwesomeIcon icon={solidThumbsUp} style={{color: "#74C0FC"}} className="like-icon"/>
                                </button>
                                    :  
                                <button onClick={()=>{ likeHandler(item.userID,usernameLOG)}}>{/* sending the current post id and user name */}
                                    <FontAwesomeIcon icon={regularThumbsUp} style={{ color: "#74C0FC" }} className="like-icon" />
                                </button>
                                }
                                {/* like_counter */}
                                        <span onClick={()=>{
                                            setLikedPanel(item.userID);
                                            if(showuserlikes){

                                            setShowUserLikes(false)
                                        }else{
                                            setShowUserLikes(true)
                                        }
                                        
                                        }} className="like_counter_display">{Object.keys(item.like).length}</span>
                                {/* like_counter */}
                                </div>
                            <button onClick={()=>{
                                setCommentPanel(item.userID)
                                if(showcommentpanel){
                                    setShowCommentPanel(false)
                                }else{
                                    setShowCommentPanel(true)
                                }}}>Comment<span style={{color:'red', fontWeight:"bolder",marginLeft:"5px",fontSize:'13px'}}>{Object.keys(item.comment).length}</span></button>
                            
                         
                            {shownavbuttons?<>
                                {item.userName==usernameLOG?(
                                <button onClick={()=>{
                                    if(edited){
                                        setEdited(false);
                                    }else{
                                        setEdited(true);
                                    }
                                    setCurrentIndex(item.userID)
                                }} className="edit-font-img"><img src="/assets/edit.png"/></button>
                            ):""}
                            {item.userName==usernameLOG?(
                                <button onClick={()=>DeleteMethod(item.userID)}><img src=" /assets/bin.png" className="delete-font-img"/></button>
                            ):""}
                            </>:""}
                            </div>
                           
                            {showcommentpanel&&item.userID==commentpanel?
                            <div className="commented_users">
                              <ul>
                              {Object.entries(item.comment).map(([key,val],idx)=>{
                                const keys=key.split('-')[0];
                                    return <li key={idx}>{keys}:{val.content}</li>
                            })}
                              </ul>
     <>
     <form onSubmit={(e)=>commentHandler(e,item.userID,usernameLOG,commentdata)}>
     Comment:<input type='text' value={commentdata}  onChange={(e)=>setCommentData(e.target.value)}/>
     <button type="submit" >submit</button>
 </form>
 </>
                            </div>:""    
                        } 
                           
                     </li>
                     
            })
            
            }
            </div>
            
          </ul>
        
        </>
    )
}