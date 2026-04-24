'use client'
import React, { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { db } from '../config/Config'
import { Card, Button, Typography } from '@material-tailwind/react'

function UnsubscribeForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleUnsubscribe = async () => {
    if (!email) return
    setStatus('loading')
    try {
      await db.collection('unsubscribed').add({
        email,
        unsubscribedAt: new Date().toISOString(),
      })
      setStatus('success')
    } catch (err) {
      console.error('Unsubscribe error:', err)
      setStatus('error')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card color="white" shadow={true} className="p-10 max-w-md w-full flex flex-col items-center gap-4">
        {!email ? (
          <Typography variant="h5" color="red">
            No email address provided.
          </Typography>
        ) : status === 'success' ? (
          <>
            <Typography variant="h5" color="blue-gray">
              You&apos;ve been unsubscribed.
            </Typography>
            <Typography color="gray" className="text-center font-normal">
              <span className="font-semibold">{email}</span> will no longer receive emails from us.
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h5" color="blue-gray">
              Unsubscribe
            </Typography>
            <Typography color="gray" className="text-center font-normal">
              Click below to unsubscribe <span className="font-semibold">{email}</span> from future emails.
            </Typography>
            {status === 'error' && (
              <Typography color="red" className="text-center text-sm">
                Something went wrong. Please try again.
              </Typography>
            )}
            <Button
              onClick={handleUnsubscribe}
              disabled={status === 'loading'}
              className="bg-red-500 hover:bg-red-700 w-full"
            >
              {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}

export default function Unsubscribe() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <UnsubscribeForm />
    </Suspense>
  )
}
