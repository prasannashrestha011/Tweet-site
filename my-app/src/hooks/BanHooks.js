import { useContext } from "react";
import { BanContext } from "./Banstatus";
export default function BanHooks(){
    return useContext(BanContext);
}