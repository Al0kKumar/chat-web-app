import react from 'react'
import FullWidthTextField from '../components/MUIinput'
import ButtonSizes from '../components/MUIbutton'

const Login = () => {
    return (
      <div className='flex flex-col justify-center items-center h-screen '>
        <div className='w-full max-w-md'>
        <div className='p-4 '>
        <FullWidthTextField label='Enter Email' type='email'/>
        </div>
        <div className='p-4 '>
            <FullWidthTextField label='Enter password' type='password'/>
        </div>
        <div className='p-4 flex justify-center'>
            <ButtonSizes label='Login'/>
        </div>
        </div>
      </div>
    )
}

export default Login