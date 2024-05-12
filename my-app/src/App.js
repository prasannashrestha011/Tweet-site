import React ,{useState,createContext}from 'react';
import './App.css'
import TodoForm from './components/todoform';
import List from './components/todoList';
import FileHandler from './components/fileupload';

import RequireAuth from './hooks/requireAuth';
import TodoProvider from './context/todocontext';
import { useLocation } from 'react-router-dom';
export const NameContext=createContext();

const App=()=>{


 
  return(
    <>
      <TodoProvider>
        <TodoForm/>
          <FileHandler/>
             <List/>
      </TodoProvider>
     
 
      </>
     
    

    
    
  
  )
}
export default App