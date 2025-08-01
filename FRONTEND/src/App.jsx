import React from 'react'
import { Routes, Route, Navigate } from 'react-router'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import NotificationsPage from './pages/NotificationsPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import OnboardingPage from './pages/OnboardingPage'

import {Toaster} from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios.js'

const App = () => {

  const {data:authData, isLoading, error} = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');
      return res.data;
    }
  })

  const authUser = authData?.user;


  return (
    <div className='h-screen' data-theme="night">
   <Routes>
    <Route path="/" element={authUser? <HomePage />: <Navigate to="/login"/>} />
    <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/"/>} />
    <Route path="/login" element={!authUser?<LoginPage />:<Navigate to="/"></Navigate>} />
    <Route path="/notifications" element={authUser?<NotificationsPage />: <Navigate to="/login"/>} />
    <Route path="/call" element={authUser?<CallPage />: <Navigate to="/login"/>} />
    <Route path="/chat" element={authUser?<ChatPage />: <Navigate to="/login"/>} />
    <Route path="/onboarding" element={authUser?<OnboardingPage />: <Navigate to="/login"/>} />

   </Routes>

   <Toaster/>
    </div>
  )
}

export default App
