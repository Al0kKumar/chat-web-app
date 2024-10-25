import react from 'react'


interface propstype{
    name : string
}

const ChatHeader = (props:propstype) => {

    return (
        <div className='flex-initial bg-slate-800 sticky'>
           <div className='text-white'>{props.name}</div>
           <div></div>
        </div>
    )
}

export default ChatHeader;