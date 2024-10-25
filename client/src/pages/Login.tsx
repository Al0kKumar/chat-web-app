import React, { useState } from 'react';
import axios from 'axios';
import FullWidthTextField from '../components/MUIinput';
import ButtonSizes from '../components/MUIbutton';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/v1/login', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard')
      } else {
        setError('Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      setError('Login failed');
    }
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen '>
      <div className='w-full max-w-md'>
        <div className='p-4 '>
          <FullWidthTextField label='Enter Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='p-4 '>
          <FullWidthTextField label='Enter password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className='p-4 flex justify-center'>
          <ButtonSizes label='Login' onClick={handleSubmit} />
        </div>
        {error && <p className='text-red-500'>{error}</p>}
      </div>
    </div>
  );
};

export default Login;