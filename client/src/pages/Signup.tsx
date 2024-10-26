import React, { useState } from 'react';
import FullWidthTextField from '../components/MUIinput';
import ButtonSize from '../components/MUIbutton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError(null);
        setLoading(true);

        const formData = {
            name,
            email,
            phoneNumber,
            password,
        };

        localStorage.setItem('email', email);

        try {
            console.log('Sending signup request with data:', formData); // Logging request data for debugging
            const response = await axios.post('http://localhost:3000/api/v1/signup', formData);
            console.log('Signup successful:', response.data);
            navigate('/otp', { state: { email } }); // Navigate to OTP page and pass email
        } catch (err) {
            console.error('Error during signup:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <form className="w-full max-w-md" onSubmit={handleSubmit}>
                <div className="p-3">
                    <FullWidthTextField
                        label="Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="p-3">
                    <FullWidthTextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="p-3">
                    <FullWidthTextField
                        label="Phone Number"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className="p-3">
                    <FullWidthTextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <div className="p-3 flex justify-center">
                    <ButtonSize label={loading ? 'Signing Up...' : 'Signup'} /> {/* Removed onClick */}
                </div>
            </form>
        </div>
    );
};

export default Signup;
