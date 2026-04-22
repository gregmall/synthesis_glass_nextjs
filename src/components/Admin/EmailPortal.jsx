'use client'
import React, { useContext, useState, useEffect } from 'react'
import { sendEmail } from '../../app/api/email/route.js';
import { db } from '../../config/Config';
import { Card,
    Input,
    Button,
    Typography,
    Textarea } from "@material-tailwind/react";

const EmailPortal = () => {
  


  const [emailStatus, setEmailStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailData, setEmailData] = useState(null)
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [recipient, setRecipient] = useState('')
  const [htmlMessage, setHtmlMessage] = useState('')
useEffect(() => {
    const fetchEmail = async () => {
      try {
        const users = await db.collection('users').get();
        const usersData = users.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const emails = usersData.map(user => user.email);
        setEmailData(emails);
       
      } catch (error) {
        console.error('Error fetching email:', error);
      }

    }
    fetchEmail();
}, [])

  const handleSendEmail = async (e) => {
   
    e.preventDefault()
    setLoading(true)
    
    try {
      await sendEmail({
        to: email,
        subject: subject,
        text: message,
        html: htmlMessage
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '100px', flexDirection: 'column' }}>
     <div>
      <Card color="white" shadow={false} className='w-full p-11  flex flex-col items-start justify-start max-w-4xl'>
        <Typography variant="h4" color="blue-gray">
          Email
        </Typography>
        <form onSubmit={handleSendEmail} className='w-full mt-4 mb-2 max-w-screen-lg sm:w-96'>
        <Typography color="gray" className="mt-1 font-normal">
          Recipient Email:
        </Typography>
          <div className='flex '><Input type="text" value={email}  className='mb-4' onChange={(e)=>setEmail(e.target.value)}  /><Button onClick={() => setEmail('')} className='mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-3'>x</Button></div> 
        <Typography color="gray" className="mt-1 font-normal">
          Subject:
        </Typography>
        <div className='flex'><Input type="text" value={subject} className='mb-4' onChange={(e)=>setSubject(e.target.value)}  /><Button onClick={()=> setSubject('')} className='mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-3'>x</Button></div>
 
      
        <Typography color="gray" className="mt-1 font-normal">
          Message:
        </Typography>
        <div className='flex'><Textarea value={message} onChange={(e)=> setMessage(e.target.value)}  className='mb-4' /><Button onClick={()=> setMessage('')} className='mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-3'>x</Button></div>  
        <Typography color="gray" className="mt-1 font-normal">
          HTML Message (optional):
        </Typography>
        <div className='flex'><Textarea value={htmlMessage} onChange={(e)=> setHtmlMessage(e.target.value)}  className='mb-4' /><Button onClick={()=> setHtmlMessage('')} className='mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-3'>x</Button></div>
        <Button type="submit" disabled={loading} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onSubmit={handleSendEmail}>
          {loading ? 'Sending...' : 'Send Email'}
        </Button>       
        </form>
      </Card>   
      </div>
      <div className='mx-4'>
           <Typography variant="h4" color="white">
            User Emails
          </Typography>
        <Card color="white" shadow={false} className='w-full p-11 mt-3 flex flex-col items-start justify-start max-w-lg overflow-y-auto max-h-[300px]'>

          {emailData ? (
            emailData.map((addr, index) => (
              <Typography
                key={index}
                color="gray"
                className={`mt-1 font-normal cursor-pointer px-2 py-1 rounded w-full hover:bg-blue-50 ${email === addr ? 'bg-blue-100 font-semibold text-blue-800' : ''}`}
                onClick={() => setEmail(addr)}
              >
                {addr}
              </Typography>
            ))
          ) : (
            <Typography color="gray" className="mt-1 font-normal">
              Loading emails...
            </Typography>
          )}
        </Card>
      </div>
 
      {emailStatus && <p className='ml-4 text-white'>{emailStatus}</p>} 
    </div>
  )
}

export default EmailPortal;

