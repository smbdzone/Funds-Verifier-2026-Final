import React from 'react'

const page = () => {
  return (
    <div className='flex justify-center items-center h-screen bg-white'>
      <div className='text-center p-5'>
        <h1 className='lg:text-3xl sm:text-xl text-lg font-semibold text-red-600'>
          Unauthorized
        </h1>
        <p className='mt-4 lg:text-xl sm:text-lg text-base text-gray-700'>
          You do not have permission to access this page. Please contact the
          administrator if you believe this is an error.
        </p>
        <div className='flex gap-5 w-full justify-center items-center'>
          <a
            href='/'
            className='mt-6 inline-block md:px-6 px-3 py-2 md:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            Go Home
          </a>
          <a
            href='/login'
            className='mt-6 inline-block md:px-6 px-3 py-2 md:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            Login
          </a>
        </div>
      </div>
    </div>
  )
}

export default page
