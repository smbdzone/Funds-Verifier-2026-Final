import React from 'react'
import { CloseIcon } from './Icons'
const Modal = ({ show, onClose, title, content }) => {
  if (!show) {
    return null
  }

  return (
    <>
      {/* Background overlay */}
      <div className='fixed flex inset-0 modal-bg  z-10'></div>

      {/* Modal dialog */}
      <div className='fixed inset-0 flex justify-center  items-center z-20 pr-16'>
        <div className='relative bg-white p-4 rounded-lg md:w-[369px] z-30'>
          <div className=' flex justify-between items-center'>
            <h2 className='text-[#8D7C3B] w-full text-[25px] text-center'>
              {title}
            </h2>
            <span
              className='absolute text-xl top-[4%] right-[4%] cursor-pointer'
              onClick={onClose}
            >
              <CloseIcon />
            </span>
          </div>
          <p className='text-black text-center text-[15px]'>{content}</p>
        </div>
      </div>
    </>
  )
}

export default Modal
