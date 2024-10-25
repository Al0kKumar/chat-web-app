import react from 'react'
import { useState } from 'react'
import FullWidthTextField from '../components/MUIinput'
import ButtonSize from '../components/MUIbutton'
import axios from 'axios'


const Signup = () => {

    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = () => {
      
        const formdata = {
            name,
            email,
            phonenumber,
            password
        }

        const res = axios.post('http://localhost:3000/api/v1/signup', formdata)


    }

    return (
        <div className='flex flex-col justify-center items-center h-screen'>
        <div className='"w-full max-w-md'>
            <div className='p-3 '>
        <FullWidthTextField label= 'Name'type='text' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className='p-3 '>
        <FullWidthTextField label='Email' value={email} onChange={(e) => setEmail(e.target.value)} type='email'/>
           </div>
           <div className='p-3'>
        <FullWidthTextField label='PhoneNumber' value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)} type='phone'/>
          </div> 
          <div className='p-3'>
        <FullWidthTextField label='password' value={password} onChange={(e) => setPassword(e.target.value)} type='password'/>
          </div>  
         <div className='p-3  flex justify-center'>
         <ButtonSize label='Signup' onClick={handleSubmit}/>   
         </div>   
        </div>
        </div>
    )
}

export default Signup