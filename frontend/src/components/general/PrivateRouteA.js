import React from 'react'
import { Navigate } from 'react-router-dom';
export default function PrivateRouteA({children}){
    const token = localStorage.getItem('token');
    if(!token)
    {
        return children;
    }
    else 
    {
        const currentTime = Math.floor(Date.now() / 1000);
        if(token.exp && token.exp < currentTime)
        {
            return children;
        }
        else 
        {
            return <Navigate to="/home" />
        }
    }
}