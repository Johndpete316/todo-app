import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/app.css'

import Login from './components/Login'
import Home from './components/Home'
import Navbar from './components/Navbar'

function App() {

  return (
    <div className="app">
      <Navbar />
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
