import MessageInput from "../components/MessageInput"
import MessageItem from "../components/MessageItem"
import ChatHeader from "../components/ChatHeader"


// web socket stuff will be made here cuz , this page is specifically for chatting so web socket will be here only



const Chats = () => {

    return (
        <div className="bg-slate-950 min-h-screen">
             
            <ChatHeader/>
             
           
           <MessageItem/>


            <MessageInput/>

        </div>
    )
}

export default Chats