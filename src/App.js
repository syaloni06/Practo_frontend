// App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import SignUp from './components/SignUp';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import BookTest from './components/BookTest';



const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    
    console.log(isAuthenticated);
    console.log(userInfo);
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SignUp />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserInfo={setUserInfo} />} />
                <Route path="/booktest" element={
                    isAuthenticated ? (
                        <BookTest userInfo={userInfo}></BookTest>
                    ) : (
                        <Navigate to="/login" />
                    )
                } />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
