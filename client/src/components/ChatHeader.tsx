interface header{
    name : string
}

const ChatHeader = ({ name }: header) => {
    return (
        <div className="bg-gray-800 p-4 text-white">
            <h2 className="text-xl font-semibold">{name}</h2>
        </div>
    );
};

export default ChatHeader;
