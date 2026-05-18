import React from 'react'
import SearchInputs from '../Inputs/SearchInputs'

const SearchInputModal = ({ setIsOpen }) => {
  return (
    <div className='fixed w-full h-screen inset-0 lg:hidden bg-black bg-opacity-75 flex items-center justify-center z-50'>
      <div className='bg-white h-[700px] max-h-screen rounded-lg px-3 w-fit flex flex-col gap-6'>
        <div className='w-full flex justify-end items-center'>
          <button onClick={() => setIsOpen(false)} className='text-lg'>
            x
          </button>
        </div>
        <div className='pb-6 px-16 md:px-20'>
          <SearchInputs setIsOpen={setIsOpen} />
        </div>
      </div>
    </div>
  )
}

export default SearchInputModal
