import React, { createContext } from 'react'
import { getLocalstorage } from '../Utils/Localstorage.jsx'
import { useEffect, useState } from 'react'


export const AuthContext = createContext()
const AuthProvider = ({children}) => {

   const [userdata, setuserdata] = useState(null)

   useEffect(() => {
    const credentials = getLocalstorage()
    setuserdata(credentials)

   }, [])
   
   

  return (
    <div>
      <AuthContext.Provider value = {userdata}>
        {children}
      </AuthContext.Provider>
    </div>
  )
}

export default AuthProvider
