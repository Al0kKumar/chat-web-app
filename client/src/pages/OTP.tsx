import React, { useState , useEffect} from 'react';
import OTPInput from '../components/OtpInput';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const OtpPage: React.FC = () => {
    const [OTP, setOTP] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const location = useLocation();
    const email = location.state?.email


    const handleSubmit = async () => {
        if (OTP.length === 6) {
            setLoading(true);
            setError(null);

            const tosend = {
                email,
                OTP,
            };

            try {
                const res = await axios.post('http://localhost:3000/api/v1/verify-otp', tosend);

                if (res.data.token) {
                    localStorage.setItem('token', res.data.token); // Store token in local storage
                    navigate('/dashboard'); // Redirect to dashboard
                } 
            }
                catch (err) {
                console.error('Error verifying OTP:', err);
                setError('An error occurred while verifying OTP. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please enter a valid OTP of length 6');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-semibold mb-4">Enter OTP</h1>
            <OTPInput value={OTP} onChange={setOTP} />
            {error && <p className="mt-2 text-red-500">{error}</p>}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className={`mt-4 px-6 py-2 ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded-lg hover:bg-blue-600 transition`}
            >
                {loading ? 'Verifying...' : 'Verify'}
            </button>
        </div>
    );
};

export default OtpPage;
