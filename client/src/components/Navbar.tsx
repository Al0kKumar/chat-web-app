import React from 'react'

function Navbar() {
  return (
    <div className='bg-slate-900 flex justify-between'>
         <div>
            <h1 className='text-white mt-1 p-3 font-serif font-medium'>Whats app</h1>
         </div>
         <div>
            <input className =' text-base text-white mr-10 mb-3 mt-2 w-96 py-2 px-1 bg-transparent border border-white rounded-2xl'  placeholder='search'></input>
         </div>
    </div>
  )
}

export default Navbar