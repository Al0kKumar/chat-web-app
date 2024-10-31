import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

interface CustomInputProps {
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; // Make placeholder optional
}

const CustomInput: React.FC<CustomInputProps> = ({  type, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility

  const handleTogglePassword: React.MouseEventHandler<HTMLSpanElement> = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  return (
    <div className="flex flex-col mb-4">
      <div className="relative">
        <input
          type={showPassword ? 'text' : type} // Use text if password is to be shown
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-400 rounded-md bg-slate-900 text-white placeholder-white"
          placeholder={placeholder} // Use placeholder prop
        />
        {type === 'password' && (
          <span
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <AiFillEyeInvisible size={20} className="text-white" /> : <AiFillEye size={20} className="text-white" />}
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
