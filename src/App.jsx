import React from 'react'
import Login from './Pages/Login.jsx'
import Datafetch from './Pages/Datafetch.jsx'
import Header from './Others/Header.jsx'
import { AuthContext } from './Auth/AuthProvider.jsx'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import Audit from './Pages/Audit.jsx'

const App = () => {

   const [user, setuser] = useState(null)
  const [loggedinuserdata, setloggedinuserdata] = useState(null)
  const Authdata = useContext(AuthContext)

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser")

    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser)
      setuser(userData.role)
      setloggedinuserdata(userData.data)
    }
  }, [])

 const handleLogin = (username, password) => {
    if (!Authdata) return;

    const credentials = Authdata.find((e) => username == e.username && password == e.password)
    if (credentials) {
      setuser('testuser')
      setloggedinuserdata(credentials)
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'testuser', data: credentials }))
      return;
    }

    alert("Invalid Credentials")
  }

  return (
    <div>
      {/* {!user ? <Login handleLogin={handleLogin} /> : ''}
      {user == 'testuser' ? <Datafetch Changeuser = {setuser} data={loggedinuserdata} /> : null} */}
      {/* <Login /> */}
      {/* <Datafetch /> */}
      {/* <Header/> */}
      <Audit/>

    </div>
  )
}

export default App;