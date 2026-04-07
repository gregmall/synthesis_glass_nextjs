'use client'
import { createContext, useState, useEffect } from 'react'
import { auth, db } from '../config/Config'

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {

  const [user, setUser] = useState({});

  useEffect(() => {
    let unsubscribeSnapshot = null

    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot()
        unsubscribeSnapshot = null
      }
      if (user) {
        unsubscribeSnapshot = db.collection('users').doc(user.uid).onSnapshot(snapshot => {
          setUser({ 
            email: snapshot.data()?.email,
            name: snapshot.data()?.name,
            userRole: snapshot.data()?.userRole,
            id: snapshot.data()?.id,
            cart: snapshot.data()?.cart,
            history: snapshot.data()?.history
          })
          localStorage.setItem('user', JSON.stringify(user))
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeSnapshot) unsubscribeSnapshot()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider;
