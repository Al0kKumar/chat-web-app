
interface MessageItemProps {
  message: string;
  isSender: boolean;
  timestamp: string
}

const MessageItem = ({ message, isSender,timestamp }: MessageItemProps) => {

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid time'; // Fallback if date is not valid
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
    {message && (
      <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`rounded-lg p-2 max-w-xs ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
        <p>{message}</p>
        
        <span className={`text-xs ${isSender ? 'text-white' : 'text-slate-900'}`}>
          {/* {timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Invalid time'} */}
       {timestamp ? formatTime(timestamp) :'Invalid time'}
      </span>
    </div>
  </div>
    )}
    </div>
  );
};

export default MessageItem;
