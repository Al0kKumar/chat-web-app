import react from 'react'
import FullWidthTextField from '../components/MUIinput'
import ButtonSize from '../components/MUIbutton'

const Signup = () => {

    return (
        <div className='flex flex-col justify-center items-center h-screen'>
        <div className='"w-full max-w-md'>
            <div className='p-3 '>
        <FullWidthTextField label= 'Name'type='text'/>
            </div>
            <div className='p-3 '>
        <FullWidthTextField label='Email' type='email'/>
           </div>
           <div className='p-3'>
        <FullWidthTextField label='PhoneNumber' type='phone'/>
          </div> 
          <div className='p-3'>
        <FullWidthTextField label='password' type='password'/>
          </div>  
         <div className='p-3  flex justify-center'>
         <ButtonSize label='Signup'/>   
         </div>   
        </div>
        </div>
    )
}

export default Signup