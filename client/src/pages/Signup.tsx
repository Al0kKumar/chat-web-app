import React, { useState } from 'react';
import ButtonSize from '../components/MUIbutton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/CustomInput';
import { Link } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null); 
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error state on each submit
        setLoading(true);

        const formData = { name, email, phoneNumber, password };
        localStorage.setItem('email', email);

        try {
            console.log('Sending signup request with data:', formData);
            const response = await axios.post('http://localhost:3000/api/v1/signup', formData);
            console.log('Signup successful:', response.data);
            navigate('/otp', { state: { email } });
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response) {
                // Check for a 401 status code
                if (err.response.status === 401) {
                    setError('Incorrect or incomplete information. Please check your inputs.');
                } else {
                    setError('An error occurred. Please try again later.');
                }
            } else {
                setError('An unexpected error occurred.');
            }
            console.error('Error during signup:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 flex flex-col justify-center items-center h-screen">
            <form className="w-full max-w-md" onSubmit={handleSubmit}>
                <div className="p-3">
                    <CustomInput
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="p-3">
                    <CustomInput
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="p-3">
                    <CustomInput
                        type="tel"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className="p-3">
                    <CustomInput
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {/* Display error message */}
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}

                <div className='flex justify-center text-white '> 
                    <div >
                    Already signedin ? <Link to='/login' className="text-blue-500 underline"> login</Link>
                    </div>
                </div>
                <div className="p-3 flex justify-center">
                    <ButtonSize label={loading ? 'Signing Up...' : 'Signup'} />
                </div>
            </form>
        </div>
    );
};

export default Signup;
