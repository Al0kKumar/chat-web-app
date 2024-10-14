// src/pages/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/v1/login', { phoneNumber, password });
            localStorage.setItem('token', res.data.token); // Store JWT
            navigate('/dashboard'); // Redirect to chat
        } catch (err: any) {
            setError('Invalid login credentials');
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-full max-w-xs">
                <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="mb-4 text-xl font-bold">Login</h2>
                    {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            placeholder='Enter phone number'
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            placeholder='Enter your password'
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
