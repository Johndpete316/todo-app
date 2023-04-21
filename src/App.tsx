import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import './styles/app.css'

import Login from './components/Login'
import Home from './components/Home'

function App() {

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>

    </div>
  )
}

export default App
