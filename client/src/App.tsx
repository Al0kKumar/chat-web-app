import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import OtpPage from './pages/OTP';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/otp' element={<OtpPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/chat' element={<ChatPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
