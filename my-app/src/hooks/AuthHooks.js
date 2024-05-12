import { useContext } from "react";
import { AuthContext } from "../context/auth";
export default function AuthHooks(){
        return (
            useContext(AuthContext)
        )
}