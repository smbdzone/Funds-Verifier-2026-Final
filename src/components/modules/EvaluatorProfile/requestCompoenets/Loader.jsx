import { FaSpinner } from 'react-icons/fa'

const Loader = ({ isOpen }) => {
  if (!isOpen) return null
  return (
    <>
      {isOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white rounded-md shadow-md w-40 h-40 flex justify-center items-center'>
            <FaSpinner className='animate-spin' />
          </div>
        </div>
      )}
    </>
  )
}

export default Loader
