'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ProtectedRoute = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem('user'))
    if (userFromStorage?.uid !== process.env.NEXT_PUBLIC_ADMIN_ID) {
      router.push('/404')
    }
  }, [router])

  const userFromStorage = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user'))
    : null

  if (userFromStorage?.uid !== process.env.NEXT_PUBLIC_ADMIN_ID) {
    return null
  }

  return children
}

export default ProtectedRoute
