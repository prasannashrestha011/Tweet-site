import React from 'react'
import ReactDOM from 'react-dom'
import App from './App';
import Default from './pages/Defaultpage';
import FilePage from './components/filePage';
import Register from './pages/register';
import FetchRegUser from './pages/listOfUsers';
import DataEntry from './pages/dataentry';
import LoginHandler from './pages/login';
import RequireAuth from './hooks/requireAuth';
import NotFound from './pages/404';
import BanPage from './pages/BanPage';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import { AuthProvider } from './context/auth';
import AdminLoginProvider from './context/adminlogincontext';
import AdminLoginCode from './pages/adminlogincode';
import Controller from './hooks/controller';
import AdminRegister from './pages/admin-register';
import RequireAdminCode from './context/requireadmincode';
import { BanProvider } from './hooks/Banstatus';

const ROLES={
    
    'Admin':"admin"
}
ReactDOM.render(
    <AuthProvider>
<Router>
    <Routes>
    <Route path='/register' element={<Register/>} />
  
            <Route element={<AdminLoginProvider/>}>
                <Route path='/admin-login-code' element={<AdminLoginCode/>} />
                <Route element={<RequireAdminCode/>}>
                     <Route path='/admin-register' element={<AdminRegister/>} />
                </Route>
              
            </Route>
        <Route path='/' element={<Default/>} />
        <Route path='/login' element={<LoginHandler/>} />  
            {/*  protected Route*/}   
        <Route  element={<RequireAuth/>}>  
           <Route element={<BanProvider/>}>
                    <Route path='/home' element={<App/>} />
                     <Route path='/file-upload' element={<FilePage/>} />
                     <Route path='/data-entry' element={<DataEntry/>} />
                     <Route element={<Controller/>}>
                        <Route path='/list-of-user' element={<FetchRegUser/>} />
                    </Route>
                    
             </Route>
            </Route>
            <Route path='/banned-user' element={<BanPage/>} />
     
         {/*  protected Route*/}
         <Route path='/*' element={<NotFound/>} />
    </Routes>
</Router>
</AuthProvider>
    ,document.querySelector('#root'));