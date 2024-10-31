import React, { useState } from 'react';
import axios from 'axios';
import ButtonSizes from '../components/MUIbutton';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/CustomInput';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/api/v1/login', {
                email,
                password,
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            } else {
                setError('Invalid credentials'); // Handle invalid credentials
            }
        } catch (error: any) {
            console.error('Login error:', error.message);
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setError('Incorrect email or password.'); // Specific 401 error message
            } else {
                setError('Login failed. Please try again.'); // General error message
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-slate-900 flex flex-col justify-center items-center h-screen'>
            <div className='w-full max-w-md'>
                <form onSubmit={handleSubmit}>
                    <div className='p-4'>
                        <CustomInput
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='p-4'>
                        <CustomInput
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {/* Display error message */}
                    {error && <p className='text-red-500 text-center mt-2'>{error}</p>}
                    <div className='flex justify-center text-white '> 
                    <div >
                    have not signed up ? <Link to='/' className="text-blue-500 underline"> Signup</Link>
                    </div>
                </div>
                    <div className='p-4 flex justify-center'>
                        <ButtonSizes label={loading ? 'Logging in...' : 'Login'} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
