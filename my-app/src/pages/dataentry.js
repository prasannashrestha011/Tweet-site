import React ,{useState,useEffect }from "react";
import '../Css/dataentry.css'
import axios from 'axios'
export default function DataEntry(){
    const [transaction_name,setTransaction_name]=useState('');
    const [transaction_amount,setTransaction_amount]=useState(0);
    const [fetchtransaction,setFetchTransaction]=useState('');
    const sendTransaction=async(e)=>{
        e.preventDefault();
        const formData=new FormData();
        formData.append('transaction_name',transaction_name);
        formData.append('transaction_amount',transaction_amount);
        try{
            const response=await axios.post('http://localhost:3004/transactions-data',formData,{
                Headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            if(response.status!=200) throw new Error('failed to fetch the API');
            const result=await response.data;
            console.log(result);
            setTransaction_name('');
            setTransaction_amount(0);
            return

        }catch(err){
            console.log(err)
        }
    }
    const deleteTransactions=async(transaction_id)=>{
        try{
            const response=await axios.delete(`http://localhost:3004/transactions-data/${transaction_id}`);
        if(response.status!=200) throw new Error('failed to fetch the API');
        console.log(response.data);
        return;
        }catch(err){
            console.log(err)
        }
    }
    const fetchTransaction=async()=>{
        try{
            const response=await axios.get('http://localhost:3004/transactions-data');
            if(response.status!=200) throw new Error('failed to fetch the API');
            const result=await response.data;
                console.log(result,"is from sql")
                setFetchTransaction(result);
                return
        }catch(err){
            console.log(err);
            return;
        }
    }
    useEffect(()=>{
        fetchTransaction();
    },[fetchtransaction])
    return(
        <>
        <center><h1>DataEntry</h1></center>
        <div>
        <form onSubmit={sendTransaction}>
            <label for="transaction_name">Trasanction Name</label>
            <input value={transaction_name} onChange={(e)=>setTransaction_name(e.target.value)} id="transaction_name"/>
            <label for='transaction_amount'>Transantion Amount:</label>
            <input type="number" id="transaction_id" value={transaction_amount} onChange={(e)=>setTransaction_amount(e.target.value)}/>
            <button type="submit">Submit</button>
        </form>
        </div>
        <div className="transaction_table_">
            <ul>
            {fetchtransaction&&fetchtransaction.map((item,index)=>{
                return <li key={index}><div className="transaction-container"><div>{item.transaction_id}</div><div>{item.transaction_name}</div><div>{item.transaction_amount}</div><button onClick={()=>deleteTransactions(item.transaction_id)}>Delete</button></div></li>
            })}
            </ul>
        </div>
       
        </>
    )
}