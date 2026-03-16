import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/Login.jsx'
import Datafetch from './Pages/Datafetch.jsx'
import Audit from './Pages/Audit.jsx'
import { AuthContext } from './Auth/AuthProvider.jsx'

const App = () => {
  const [user, setuser] = useState(null)
  const [loggedinuserdata, setloggedinuserdata] = useState(null)
  const Authdata = useContext(AuthContext)

  // Check localStorage on initial load
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

    const credentials = Authdata.find((e) => username === e.username && password === e.password)
    
    if (credentials) {
      const role = 'testuser'
      setuser(role)
      setloggedinuserdata(credentials)
      localStorage.setItem('loggedInUser', JSON.stringify({ role: role, data: credentials }))
    } else {
      alert("Invalid Credentials")
    }
  }

  const handleLogout = () => {
    setuser(null)
    setloggedinuserdata(null)
    localStorage.removeItem('loggedInUser')
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route: If already logged in, redirect to Dashboard */}
        <Route 
          path="/login" 
          element={!user ? <Login handleLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
        />

        {/* Dashboard Route: Protected by user state */}
        <Route 
          path="/dashboard" 
          element={user === 'testuser' ? <Datafetch changeuser={handleLogout} /> : <Navigate to="/login" />} 
        />

        {/* Audit Route: Protected, accepts dynamic employee ID */}
        <Route 
          path="/audit/:id" 
          element={user === 'testuser' ? <Audit changeuser={handleLogout} /> : <Navigate to="/login" />} 
        />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;