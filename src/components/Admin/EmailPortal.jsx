'use client'
import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/UserContextProvider';
import { sendEmail } from '../../app/api/email/route.js';

const About = () => {
  const { user } = useContext(UserContext);
  const [emailStatus, setEmailStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const array =['gregmall@hotmail.com','synthesisglass@gmail.com', 'gregmall157@gmail.com', 'wiredtoburn@gmail.com']

  const handleSendEmail = async () => {
    for (let i = 0; i < array.length; i++) {
    setLoading(true)
    try {
      await sendEmail({
        to: array[i],
        subject: 'Test Email from Synthesis Glass',
        text: `Hello, this is a test email from ${user?.name || 'a user'}!
        Learn the sacred words of praise HAIL SATAN!`
      })
      setEmailStatus('Email sent successfully!')
    } catch (error) {
      console.error('Error sending email:', error)
      setEmailStatus('Failed to send email.')
    } finally {
      setLoading(false)
    }
  }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '100px' }}>
      <span className='text-white text-4xl'>hello {user?.name}</span>
      <button onClick={handleSendEmail} disabled={loading} className='ml-4 px-4 py-2 bg-blue-500 text-white rounded'>
        {loading ? 'Sending...' : 'Send Test Email'}
      </button>
      {emailStatus && <p className='ml-4 text-white'>{emailStatus}</p>} 
    </div>
  )
}

export default About;

