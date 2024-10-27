 // MessageItem.tsx

interface MessageItemProps {
  message: string;
  isSender: boolean;
  timestamp: string
}

const MessageItem = ({ message, isSender,timestamp }: MessageItemProps) => {
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
    <div className={`rounded-lg p-2 max-w-xs ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
        <p>{message}</p>
        {/* Display the timestamp */}
        <span className="text-xs text-orange-100">
            {timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Invalid time'}
        </span>
    </div>
</div>
  );
};

export default MessageItem;
