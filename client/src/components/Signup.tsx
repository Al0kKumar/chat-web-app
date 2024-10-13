import React from 'react'

function Signup() {
  return (
    <div className='bg-slate-900 min-h-screen flex items-center justify-center'>
          <div className='text-center ' >
            <h3 className='text-white mb-1'>Name</h3>
            <input className='text-white p-1 bg-transparent mb-5 rounded-2xl border border-blue-500' placeholder='Enter name '></input>

            <h3 className='text-white mb-2'>Phone Number</h3>
            <input className='text-white p-1 mb-5 bg-transparent rounded-2xl border border-blue-500' placeholder='Enter phone number '></input>

            <h3 className='text-white mb-2'>Password</h3>
            <input className='text-white mb-5 p-1 bg-transparent rounded-2xl border border-blue-500' placeholder='Enter  password'></input>
            
            <div></div>
            <button className='text-white bg-red-400 px-2 py-1 border rounded-lg'>Signup </button>

          </div>
    </div>
  )
}

export default Signup