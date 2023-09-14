import React from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { useState } from "react";

export default function PrivateRoute({ children, allowedRoles }) {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
        return <Navigate to='/login' />
    }
    else {
        const role = token['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if (!allowedRoles.includes(role)) {
            return <Navigate to='/unauthorized' />
        }
        else {
            if (allowedRoles[0] === 'seller') {
                //setVerified(token.verified.toLowerCase());
                if (token.verified.toLowerCase() === 'false') {
                    return <Navigate to="../../unauthorized" />
                }
                else {
                    return children;
                }
            }
            else {
                return children;
            }
        }
    }
};