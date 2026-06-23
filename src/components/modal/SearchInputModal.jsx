import React from 'react'
import SearchInputs from '../Inputs/SearchInputs'

const SearchInputModal = ({ setIsOpen }) => {
  return (
    <div className='fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4 lg:hidden'>
      <div className='flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl'>
        <div className='flex items-center justify-between border-b border-[#002D4F]/10 px-4 py-3 sm:px-5'>
          <h2 className='text-base font-semibold text-prussianBlue sm:text-lg'>
            Search filters
          </h2>
          <button
            type='button'
            onClick={() => setIsOpen(false)}
            className='flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none text-prussianBlue/70 transition hover:bg-[#002D4F]/5 hover:text-prussianBlue'
            aria-label='Close filters'
          >
            ×
          </button>
        </div>
        <div className='overflow-y-auto px-4 py-5 sm:px-5'>
          <SearchInputs setIsOpen={setIsOpen} variant='modal' />
        </div>
      </div>
    </div>
  )
}

export default SearchInputModal
