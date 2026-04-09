'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const ProtectedRoute = ({ children }) => {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userFromStorage = JSON.parse(localStorage.getItem('user'))
      if (userFromStorage?.uid === process.env.NEXT_PUBLIC_ADMIN_ID) {
        setIsAuthorized(true)
      } else {
        router.push('/404')
      }
    }
  }, [router])

  if (!isAuthorized) {
    return null
  }

  return children
}

export default ProtectedRoute
