import { createContext ,useState} from "react";
export const AuthContext=createContext();
export const AuthProvider=({children})=>{
    const [auth,setAuth]=useState({});
    const [ban,setBan]=useState({});
    const [statuscheck,setStatusCheck]=useState({});
   
    return(
        <AuthContext.Provider value={{auth,setAuth,ban,setBan,statuscheck,setStatusCheck}}>
            {children}
        </AuthContext.Provider>
    )
}