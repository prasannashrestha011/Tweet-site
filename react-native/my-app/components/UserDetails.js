import React,{useState,useEffect} from 'react';
import {View,Text,Image,StyleSheet} from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import { SafeAreaView } from 'react-native-safe-area-context';
const styles=StyleSheet.create({
    detail_container:{
        flexDirection:'column',
        borderWidth:1,
        borderColor:'black',
        fontSize:25,
        width:'94%',
        marginLeft:'3%',
        marginTop:'2%',
        justifyContent:'center',
        alignItems:'center'
    },
    user_info_container:{
        borderWidth:1,
        borderColor:'grey',
        width:'102%',
        marginTop:'10%',
    },
    user_info_container_text:{
        paddingLeft:10,
        fontSize:23,
    }
   
})
export default function UserDetails({route}){
    const {username}=route.params;
    const [userdetail,setUserDetail]=useState('');
    
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
            console.log('user detail fetched')
            setUserDetail(result);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(()=>{
        fetchData();
    },[])
    return(
        <View>
            {userdetail?
            <View style={styles.detail_container}>
                <View >
                <Image style={{width:140,height:140,resizeMode:'cover',borderRadius:100}} source={{uri:`data:${userdetail.profileImg.fileType};base64,${userdetail.profileImg.encodedFile}`}} />
                </View>

            <View style={styles.user_info_container}>
                <Text style={styles.user_info_container_text}>Username:{userdetail.username}</Text>
                <Text style={styles.user_info_container_text}>Role:{userdetail.role}</Text>
                <Text style={styles.user_info_container_text}>Ban-Status:{userdetail.ban.toString()}</Text>
                <Text style={styles.user_info_container_text}>Joined-Date:{userdetail.date}</Text>
            </View>
                
            </View>
            :
            ""}
        </View>
    )
}