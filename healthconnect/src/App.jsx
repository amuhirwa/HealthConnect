import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import PatientDash from './components/dashboard/PatientDash'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>App</div>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PatientDash />} />
        <Route path="/*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
