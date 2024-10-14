import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat'
import Dashboard from './components/Dashboard'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/chat/:userid' element={<Chat/>}/>
      </Routes>
    </Router>
  )
}

export default App
