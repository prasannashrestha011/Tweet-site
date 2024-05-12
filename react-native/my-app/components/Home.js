import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity,FlatList, Image, TextInput ,View,StyleSheet} from "react-native";
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Comment from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native';
import NavIcon from 'react-native-vector-icons/AntDesign';
import Dots from 'react-native-vector-icons/Entypo'

import axios from 'axios';
import { Buffer } from "buffer";

const styles=StyleSheet.create({
    user_detail_header:{
        flexDirection:'row',
        borderWidth:1,
        borderColor:'black',
        justifyContent:'flex-end',
        paddingLeft:10,
        
    },
    user_detail_info:{
  
        flexDirection:'row',
        paddingRight:5,
        gap:5,
    }
    ,
    user_detail_text:{
        fontSize:22,
        color:'white',
        marginTop:13,
    },
    formField:{
        flexDirection:'row',
        gap:5,
        marginLeft:15,
        marginTop:10
    },
    inputField:{
        width:270,
        height:40,
        borderWidth:1,
        borderColor:"grey",
        borderRadius:15,
        color:'white',
        fontSize:25,
        paddingLeft:10
    },
    btn: {
        width: 100,
        height: 40,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
      
        borderRadius: 5,
     
    },
    btnText:{
        color:'white',
        fontSize:20,
    
    },
    
    list_container:{
        backgroundColor:'whitesmoke',
        flexDirection:'column',
        borderWidth:1,
        borderColor:"grey",
        borderRadius:18,
        overflow:'hidden',
        height:180,
        width:'90%',
        marginLeft:20,
        marginBottom:10,
        marginTop:15,
        justifyContent:'space-between'
    },
    post_header:{
        flexDirection:'row',
        borderBottomColor:'black',
        borderWidth:1,
        borderTopLeftRadius:18,
        borderTopRightRadius:18,
        borderBottomRadius:0,
        height:60,
        backgroundColor:'#b0b3b8',
        justifyContent:'space-between',
        color:'white'
    },
    like_container:{
        flexDirection:'row',
        borderWidth:1,
        borderColor:'black',
        width:150,
        justifyContent:'center',
        alignItems:'center',
        overflow:'hidden'
    },
    like_display_board: {
        flexDirection: 'column',
        width: 350,
        height: 180,
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: 'brown',
        left: '50%',
        top: '50%',
        
    },
    comment_panel:{
        width:180,
        height:30,
        borderWidth:1,
        borderColor:'black',
        borderRadius:15
    },
    navButtons:{
        
        flexDirection:'row',
        gap:10,
        marginTop:9,
        marginRight:5
    }
    
    
})
export default function Home({ route }) {
    const { username } = route.params;
    const navigation=useNavigation();
    const [userDetail, setUserDetail] = useState({});
    const [listdata,setListData]=useState('');
    const [fetchlistdata,setFetchListData]=useState([]);
    const [likepanel,setLikedPanel]=useState(false);
    const [currentidxlike,setCurrentIdxLike]=useState('');
    const [comment,setComment]=useState('');
    const [commentpanel,setCommentPanel]=useState(false);
    const [currentidxcomment,setCurrentIdxcomment]=useState('');
    const [editPanel,setEditPanel]=useState(false);
    const [currenteditidx,setCurrentEditIdx]=useState('');
    const [editvalue,setEditValue]=useState('');
    const [enablenavbtn,setEnableNavBtn]=useState(false);
  
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://192.168.101.4:3004/user-detail/${username}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch the data');
            }
            const result = await response.data;
            if (result.profileImg && result.profileImg.encodedFile) {
                const base64String = Buffer.from(result.profileImg.encodedFile.data).toString('');
                result.profileImg.encodedFile = base64String;
            }
            setUserDetail(result);
        } catch (err) {
            console.log(err);
        }
    };
    const postData=async()=>{
        const response=await axios.post('http://192.168.101.4:3004/list',{
            username:username,
            list:listdata,
        });
        const result=await response.data;
            console.log('data send sucessfully {200}')
            fetchList();
            setListData('')
        return;
    }
    const fetchList=async()=>{
        try{
            const resposne=await axios.get('http://192.168.101.4:3004/list-data-app',);
            const result=await resposne.data;
           
            setFetchListData(result);
            console.log('data received from /list-data {200}');
            return
        }catch(err){
            console.log(err)
        }
        
    }
    const likeHandler=async(userID,username)=>{
        try{
            const response=await axios.patch(`http://192.168.101.4:3004/list`,{
                userID:userID,
                username:username
            })
            await response.data;
            console.log('you liked the post');
            fetchList();
            return;
        }catch(err){
            console.log(err)
        }
    }
    const commentHandler=async(userID,username,comment)=>{
      try{
        const response=await axios.patch(`http://192.168.101.4:3004/comment/${userID}`,{
            username:username,
            comment:comment
        });
        if(response.status!==200) throw new Error('failed to fetch the route');
        await response.data;
        console.log(`you have commented on the post id :${userID}`);
        setComment('')
        return 
      }catch(err){
        console.log(err)
      }
        
    }
    const deleteHandler=async(userID)=>{
       try{
        const response=await axios.delete(`http://192.168.101.4:3004/list-data/${userID}`);

        if(response.status!==200) throw new Error('failed to fetch the route')
        console.log(`your delete ${userID} post`);
        fetchList();
        return;
       }catch(err){
            console.log(err)
       }
    }
    const editHandler=async(userID)=>{
        try{
            const response=await axios.put(`http://192.168.101.4:3004/list-data/${userID}`,{
                newList:editvalue
            });
            if(response.status!==200) throw new Error('failed to fetch the route');
            console.log(`you modified the data on ${userID} post `);
            fetchList();
            return ;
        }catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        fetchData();
        fetchList();
    }, []);
   
    return (
        <>  
       
            {userDetail && userDetail.profileImg && (
                <View style={{backgroundColor:'#3a3b3c'}}>
                    <View style={styles.user_detail_header}>

                            <TouchableOpacity onPress={()=>navigation.navigate('Your Details',{username:username})}>
                               
                         <View style={styles.user_detail_info}>
                                <Image style={{ width: 50,height: 50,resizeMode: 'cover',borderRadius:100 }}source={{ uri: `data:${userDetail.profileImg.fileType};base64,${userDetail.profileImg.encodedFile}`,}}/>
                                 <Text style={styles.user_detail_text}>{userDetail.username}/{userDetail.role}</Text>
                                 </View>
                            </TouchableOpacity>
                     
                    
                    </View>
                    <View style={styles.formField}>
                     <TextInput style={styles.inputField} value={listdata} onChangeText={(text)=>setListData(text)}></TextInput>
                     <TouchableOpacity style={styles.btn} onPress={()=>postData()}><Text style={styles.btnText}>Submit</Text></TouchableOpacity>
                  
                    </View>
                    <View>
                       
                        <FlatList 
                            data={fetchlistdata}
                            keyExtractor={(item,index)=>index.toString()}
                            renderItem={({item})=>(
                               <>
                                <View style={styles.list_container}>
                                <View style={styles.post_header}>
                                    
                                    <Text style={{fontSize:25,marginTop:10,color:'whitesmoke'}}>{item.userName}/{item.role}</Text> 
                                    <View style={styles.navButtons}> 
                                    <TouchableOpacity onPress={()=>{
                                        setCurrentEditIdx(item.userID)
                                        if(enablenavbtn){
                                            setEnableNavBtn(false)
                                        }else{
                                            setEnableNavBtn(true)
                                        }
                                    }} >
                                        {username==item.userName?
                                        <>
                                        {enablenavbtn&&currenteditidx==item.userID?<Dots name="circle-with-cross" size={25}/>:   <Dots name="dots-three-horizontal" size={25} />}
                                        </>:""}
                                     
                                    </TouchableOpacity>
                                       {enablenavbtn&&currenteditidx==item.userID?<>
                                        <TouchableOpacity onPress={()=>deleteHandler(item.userID)}><NavIcon name='delete' size={25}/></TouchableOpacity>
                                            <TouchableOpacity onPress={()=>{
                                                setCurrentEditIdx(item.userID)
                                                {currenteditidx==item.userID?setEditValue(item.list):""}
                                                if(editPanel){
                                                    setEditPanel(false)
                                                }else{
                                                    setEditPanel(true)
                                                }
                                            }}><NavIcon name='edit' size={25} /></TouchableOpacity>
                                       </>
                                       :
                                        ""}
                                        </View>  
                                </View>
                              
                            
                               {editPanel&&currenteditidx==item.userID?
                               <>
                                <TextInput value={editvalue} onChangeText={(text)=>setEditValue(text)} style={{width:150,borderWidth:1,borderColor:"black"}}/>
                                <TouchableOpacity onPress={()=>editHandler(item.userID)}><Text>Done</Text></TouchableOpacity>
                               </>:""
                            }
                                <Text style={{fontSize:30,color:'grey',marginLeft:15,}}>{item.list}</Text>
                                <View style={styles.like_container}>
                               
                                <TouchableOpacity onPress={()=>{
                                            setCurrentIdxLike(item.userID)
                                            if(likepanel){
                                                setLikedPanel(false)
                                            }else{
                                                setLikedPanel(true)
                                            }
                                        }}>
                                            <Text style={{fontSize:25}}>{Object.keys(item.like).length}</Text>
                                            </TouchableOpacity>
                                    <View style={{flexDirection:'row', gap:10}}>
                                        
                                         {item.like.hasOwnProperty(username)?<TouchableOpacity onPress={()=>likeHandler(item.userID,username)}><Icon name="thumb-up" size={25}/></TouchableOpacity>:<TouchableOpacity onPress={()=>likeHandler(item.userID,username)}><Icon name="thumb-up-outline" size={25} /></TouchableOpacity>}
                                        <TouchableOpacity onPress={()=>{
                                           
                                            setCurrentIdxcomment(item.userID)
                                            setEditValue(item.list)
                                            if(commentpanel){
                                                setCommentPanel(false)
                                            }else{
                                                setCommentPanel(true);
                                            }
                                        }}>
                                            <Text><Comment name="comment" size={25} /></Text>
                                        </TouchableOpacity>
                                    </View>
                       
                                </View>
                                {commentpanel&&currentidxcomment==item.userID?
                               <>
                                <View style={{flexDirection:'row',gap:10}}>
                                    <Text>Comment:</Text>
                                    <TextInput value={comment} onChangeText={(text)=>setComment(text)} style={styles.comment_panel}></TextInput>
                                    <TouchableOpacity style={{width:80,height:30,backgroundColor:'orange',color:'white',justifyContent:'center',alignItems:'center',borderRadius:15}}  disabled={!comment.trim()} onPress={()=>commentHandler(item.userID,username,comment)}><Text>Submit</Text></TouchableOpacity>
                                 </View>
                               </>
                               :""}
                                </View>
                                {likepanel && currentidxlike == item.userID && (
                      <View style={styles.like_display_board}>
                                        <FlatList
                                        data={Object.keys(item.like)}
                                        renderItem={({ item, index }) => (
                                            <View style={styles.like_item}>
                                            <Text>{item}</Text>
                                            </View>
                                        )}
                                        keyExtractor={(key, index) => index.toString()}/>
                     </View>
                                            )}
                         

                              
                               </>
                               
                            )} />
                     
                    </View>
                </View>

            )}
           
         
        </>
    );
}
