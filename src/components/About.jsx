'use client'
import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContextProvider';
import { sendEmail } from '../app/api/email/route.js';

const About = () => {
  const { user } = useContext(UserContext);
 
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '100px' }}>
      <span className='text-white text-4xl'>hello {user?.name}</span>
      
    </div>
  )
}

export default About;

