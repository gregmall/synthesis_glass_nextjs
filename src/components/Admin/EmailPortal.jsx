'use client'
import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/UserContextProvider';
import { sendEmail } from '../../app/api/email/route.js';
import { Card,
    Input,
    Button,
    Typography,
    Textarea } from "@material-tailwind/react";

const About = () => {
  const { user } = useContext(UserContext);
  const [emailStatus, setEmailStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [recipient, setRecipient] = useState('')
  const [htmlMessage, setHtmlMessage] = useState('')
  
  

  const handleSendEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await sendEmail({
        to: email,
        subject: subject,
        text: message
      })
      setEmailStatus('Email sent successfully!')
      
    
    } catch (error) {
      console.error('Error sending email:', error)
      setEmailStatus('Failed to send email.')
    } finally {
      alert('Email sent successfully!')
      setLoading(false)
    }

  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '100px', flexDirection: 'column'}}>
     
      <Card color="white" shadow={false} className='w-full p-11 ml-4 flex flex-col items-start justify-start max-w-lg'>
        <Typography variant="h4" color="blue-gray">
          Email
        </Typography>
        <form onSubmit={handleSendEmail} className='w-full mt-8 mb-2'>
        <Typography color="gray" className="mt-1 font-normal">
          Recipeint Email:
        </Typography>
          <Input type="email" value={email}  className='mb-4' onChange={(e)=>setEmail(e.target.value)}  />
        <Typography color="gray" className="mt-1 font-normal">
          Subject:
        </Typography>
        <Input type="text" value={subject} className='mb-4' onChange={(e)=>setSubject(e.target.value)}  />
 
      
        <Typography color="gray" className="mt-1 font-normal">
          Message:
        </Typography>
        <Textarea value={message} onChange={(e)=> setMessage(e.target.value)}  className='mb-4' />  
        <Typography color="gray" className="mt-1 font-normal">
          HTML Message (optional):
        </Typography>
        <Textarea value={htmlMessage} onChange={(e)=> setHtmlMessage(e.target.value)}  className='mb-4' />
        <Button type="submit" disabled={loading} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onSubmit={handleSendEmail}>
          {loading ? 'Sending...' : 'Send Email'}
        </Button>       
        </form>
      </Card>   
      {/* <button onClick={handleSendEmail} disabled={loading} className='ml-4 px-4 py-2 bg-blue-500 text-white rounded'>
        {loading ? 'Sending...' : 'Send Test Email'}
      </button> */}
      {emailStatus && <p className='ml-4 text-white'>{emailStatus}</p>} 
    </div>
  )
}

export default About;

