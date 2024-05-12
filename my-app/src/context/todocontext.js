import React,{createContext,useState} from 'react';

export const TodoContext=createContext();
export default function TodoProvider({children}){
    const [todolist,setTodoList]=useState(false);
    return(
        <>
        <TodoContext.Provider value={{todolist,setTodoList}}>
            {children}
        </TodoContext.Provider>
        </>
    )
}