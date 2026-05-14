'use client'
import React, { useState, useEffect } from 'react'
import { sendEmail } from '../../app/api/email/route.js';
import { db } from '../../config/Config';
import { Card, Input, Button, Typography, Textarea } from "@material-tailwind/react";
import Notiflix from 'notiflix';

const EmailPortal = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [unsubscribed, setUnsubscribed] = useState(null)
  const [emailData, setEmailData] = useState(null)
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [htmlMessage, setHtmlMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersSnapshot, unsubscribedSnapshot] = await Promise.all([
          db.collection('users').get(),
          db.collection('unsubscribed').get(),
        ]);

        setEmailData(usersSnapshot.docs.map(doc => doc.data().email));

        const unsubscribedList = unsubscribedSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(doc => doc.email)
          .sort((a, b) => new Date(b.unsubscribedAt) - new Date(a.unsubscribedAt));
        setUnsubscribed(unsubscribedList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSendEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await sendEmail({
        to: email,
        subject,
        text: message,
        html: htmlMessage.replace('{{EMAIL}}', encodeURIComponent(email))
      })
      Notiflix.Notify.success('Email successfully sent!');
    } catch (error) {
      console.error('Error sending email:', error)
      Notiflix.Notify.failure('Failed to send email.');
    } finally {
      setLoading(false)
    }
  }

  const ClearButton = ({ onClick }) => (
    <Button
      onClick={onClick}
      className='ml-3 shrink-0 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none'
    >
      x
    </Button>
  )

  return (
    <div className='flex flex-col items-center mt-10 px-4 pb-12 gap-8'>

      {/* Compose form */}
      <Card color="white" shadow={false} className='w-full max-w-2xl p-10'>
        <Typography variant="h4" color="blue-gray" className='mb-6'>Email</Typography>
        <form onSubmit={handleSendEmail} className='flex flex-col gap-4'>
          <div>
            <Typography color="gray" className="mb-1 font-normal">Recipient Email</Typography>
            <div className='flex items-center'>
              <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              <ClearButton onClick={() => setEmail('')} />
            </div>
          </div>
          <div>
            <Typography color="gray" className="mb-1 font-normal">Subject</Typography>
            <div className='flex items-center'>
              <Input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
              <ClearButton onClick={() => setSubject('')} />
            </div>
          </div>
          <div>
            <Typography color="gray" className="mb-1 font-normal">Message</Typography>
            <div className='flex items-start'>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
              <ClearButton onClick={() => setMessage('')} />
            </div>
          </div>
          <div>
            <Typography color="gray" className="mb-1 font-normal">HTML Message (optional)</Typography>
            <div className='flex items-start'>
              <Textarea value={htmlMessage} onChange={(e) => setHtmlMessage(e.target.value)} />
              <ClearButton onClick={() => setHtmlMessage('')} />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className='mt-2 w-fit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none'
          >
            {loading ? 'Sending...' : 'Send Email'}
          </Button>
        </form>
      </Card>

      {/* Email lists */}
      <div className='w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex flex-col gap-2'>
          <Typography variant="h5" color="white">Account Emails</Typography>
          <Card color="white" shadow={false} className='p-6 flex flex-col overflow-y-auto max-h-72'>
            {emailData === null ? (
              <Typography color="gray" className="font-normal">Loading emails...</Typography>
            ) : (
              emailData.map((addr, index) => (
                <Typography
                  key={index}
                  color="gray"
                  className={`font-normal cursor-pointer px-2 py-1 rounded hover:bg-blue-50 ${email === addr ? 'bg-blue-100 font-semibold text-blue-800' : ''}`}
                  onClick={() => setEmail(addr)}
                >
                  {addr}
                </Typography>
              ))
            )}
          </Card>
        </div>

        <div className='flex flex-col gap-2'>
          <Typography variant="h5" color="white">Unsubscribed Emails</Typography>
          <Card color="white" shadow={false} className='p-6 flex flex-col overflow-y-auto max-h-72'>
            {unsubscribed === null ? (
              <Typography color="gray" className="font-normal">Loading...</Typography>
            ) : unsubscribed.length === 0 ? (
              <Typography color="gray" className="font-normal">No unsubscribed emails.</Typography>
            ) : (
              unsubscribed.map((addr, index) => (
                <Typography key={index} color="gray" className='font-normal px-2 py-1'>
                  {addr.email}{addr.unsubscribedAt ? ` — ${new Date(addr.unsubscribedAt).toLocaleDateString()}` : ''}
                </Typography>
              ))
            )}
          </Card>
        </div>
      </div>

    </div>
  )
}

export default EmailPortal;
