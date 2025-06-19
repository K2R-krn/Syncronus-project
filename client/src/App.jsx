import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Profile from "./pages/profile";
import Chat from "./pages/chat";
import Auth from "./pages/auth";
import { useAppStore } from './store';
import { apiClient } from './lib/api-client';
import { GET_UESR_INFO } from './utils/constants';
import { useState, useEffect } from 'react';

const PrivateRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo; // check if user info is not undefined -> then get false and redirected to auth page in below line
  return isAuthenticated ? children : <Navigate to="/auth" /> ; // 
}

const AuthRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo; // check if user info is not undefined -> then get false and redirected to auth page in below line
  return isAuthenticated ? <Navigate to="/chat" />: children ; //  
}


const App = () => {

  // check if we have userInfo or no
  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      // making an api call
      try {
        const response = await apiClient.get(GET_UESR_INFO, {
          withCredentials: true,
        });
        if(response.status === 200 && response.data.id){
          setUserInfo(response.data.user ?? response.data);
        }else{
          setUserInfo(undefined);
        }
        console.log({response});
      } catch (error) {
        setUserInfo(undefined);
      } finally{
        setLoading(false);
      }
    }
    if(!userInfo){
      getUserData();
    }else{
      setLoading(false);
    }
  }, [userInfo, setUserInfo]) // as soon as page loads we call this // and only call this when we dont have userInfo

  if(loading){ 
    return <div>Loading ...</div>
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element= <AuthRoute> {<Auth />} </AuthRoute> />
          <Route path="/chat" element=  <PrivateRoute> {<Chat />} </PrivateRoute>/>
          <Route path="/profile" element=<PrivateRoute> {<Profile />} </PrivateRoute> />

          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App