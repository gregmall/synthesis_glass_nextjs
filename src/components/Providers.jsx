'use client'
import UserContextProvider from '../context/UserContextProvider'
import Navbar from './Navbar/Navbar'

export default function Providers({ children }) {
  return (
    <UserContextProvider>
      <div className="App">
        <Navbar />
        {children}
      </div>
    </UserContextProvider>
  )
}
