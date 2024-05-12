import React,{useState} from "react";
import {Text,View,TouchableOpacity,TextInput,StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Home from "./Home";
import axios from 'axios'
const styles=StyleSheet.create({
    container:{
       
        marginTop:'62%',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'

    },
    inputField:{
        width:280,
        height:40,
        borderWidth:1,
        borderColor:"black",
        borderRadius:15
    },
    inputFieldText:{
     
        fontSize:24
    }
    ,
    btn: {
        width: 150,
        height: 50,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
      
        borderRadius: 5,
        marginTop:20
    },
    btnText:{
        color:'white',
        fontSize:20,
    
    }
})
export default function Login(){
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [userdata,setUserData]=useState({});
    const navigation=useNavigation();
    const LoginHandler=async()=>{
       
      try{
        const response=await axios.post('http://192.168.101.4:3004/login',{
            username:username,
            password:password
        });
        const result=await response.data;
        setUserData(result);
        navigation.navigate('Home',{username:username})
        return;
      }catch(err){
        console.log(err)
      }
   
    }
    
    return(
        <>
        <View style={styles.container}>
    
            <Text>ram111</Text>
            <Text style={styles.inputFieldText}>Username:</Text><TextInput value={username } onChangeText={(text)=>setUsername(text)} style={styles.inputField}/>
            <Text style={styles.inputFieldText} >Password:</Text><TextInput value={password} onChangeText={(text)=>setPassword(text)} style={styles.inputField}/>
            <TouchableOpacity style={styles.btn}><Text style={styles.btnText} onPress={()=>LoginHandler()}>Submit</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Register')}><Text>Register your account</Text></TouchableOpacity>
        </View>
        </>
    )
}