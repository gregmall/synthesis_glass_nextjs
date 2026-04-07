'use client'
import React, { useContext } from 'react'
import { UserContext } from '../context/UserContextProvider';

const About = () => {
  const { user } = useContext(UserContext);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '100px' }}>
      <span className='text-white text-4xl'>hello {user?.name}</span>
    </div>
  )
}

export default About
