import React, { useState } from 'react';
import axios from 'axios';
import FullWidthTextField from '../components/MUIinput';
import ButtonSizes from '../components/MUIbutton';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent form submission default behavior
        setLoading(true); // Start loading
        setError(''); // Clear previous errors

        try {
            const response = await axios.post('http://localhost:3000/api/v1/login', {
                email,
                password,
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token); // Store token in local storage
                navigate('/dashboard'); // Redirect to dashboard
            } else {
                setError('Invalid credentials'); // Handle invalid credentials
            }
        } catch (error: any) {
            console.error('Login error:', error.message);
            setError('Login failed. Please try again.'); // Provide more context in error message
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <div className='w-full max-w-md'>
                <form onSubmit={handleSubmit}> {/* Use form element for better accessibility */}
                    <div className='p-4'>
                        <FullWidthTextField 
                            label='Enter Email' 
                            type='email' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className='p-4'>
                        <FullWidthTextField 
                            label='Enter Password' 
                            type='password' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    {error && <p className='text-red-500'>{error}</p>} {/* Display error message */}
                    <div className='p-4 flex justify-center'>
                        <ButtonSizes 
                            label={loading ? 'Logging in...' : 'Login'}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
