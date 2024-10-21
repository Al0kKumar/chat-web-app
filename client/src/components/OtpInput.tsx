// otpInput.tsx
import React from 'react';

interface OTPInputProps {
  value: string;
  onChange: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = event.target.value;
    
    // Allow only digits
    if (/^\d*$/.test(newValue)) {
      const otpArray = value.split('');
      otpArray[index] = newValue;
      
      // Move focus to the next input if the current input is filled
      if (newValue && index < 5) {
        (document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement)?.focus();
      }
      
      onChange(otpArray.join(''));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace' && !value[index]) {
      // Move focus to the previous input if the current input is empty and backspace is pressed
      if (index > 0) {
        (document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement)?.focus();
      }
    }
  };

  return (
    <div className="flex space-x-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          maxLength={1}
          value={value[index] || ''}
          onChange={(event) => handleChange(event, index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      ))}
    </div>
  );
};

export default OTPInput;
