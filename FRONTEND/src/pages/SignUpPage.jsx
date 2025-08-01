import React, { useState } from 'react'

const SignUpPage = () => {

  const [signupData, setSignupData] = useState({fullName: '', email: '', password: ''});

  const handleSignup = (e) => {
    e.preventDefault();}

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest">
      SignUpPage
    </div>
  )
}

export default SignUpPage
