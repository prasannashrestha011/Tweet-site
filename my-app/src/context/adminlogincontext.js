import React, { createContext, useState } from "react";
import { Outlet } from "react-router-dom";

export const AdminLoginContext = createContext();

export default function AdminLoginProvider() {
    const [codecheck, setCodeCheck] = useState(false); // Initialize to false

    return (
        <AdminLoginContext.Provider value={{ codecheck, setCodeCheck }}>
            <Outlet />
        </AdminLoginContext.Provider>
    );
}
