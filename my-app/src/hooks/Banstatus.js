import { createContext ,useState} from "react";
import { Outlet } from "react-router-dom";
export const BanContext=createContext();
export const BanProvider=()=>{
    const [ban,setBan]=useState({});
    
    return(
        <BanContext.Provider value={{ban,setBan}}>
           <Outlet/>
        </BanContext.Provider>
    )
}
