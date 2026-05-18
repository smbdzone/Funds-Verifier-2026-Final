import { getCookie } from 'cookies-next'
import { getTokenFromCookie } from '../../utils/helper'
import { useProfile } from '../../context/UserContext'

const PayModal = ({
  modalData,
  technicalModalData,
  setIsOpenModal,
  userUUID,
}) => {
  const { user } = useProfile()
  // Determine which services are selected
  const has3D = !!modalData?.price
  const hasTechnical = !!technicalModalData?.price
  let service = null
  if (has3D && hasTechnical) service = 'all'
  else if (has3D) service = '_3dwalkthrough'
  else if (hasTechnical) service = 'surveyor'

  const totalPrice =
    Number(modalData.price || 0) + Number(technicalModalData.price || 0)

  const handlePay = async () => {
    const currentuserUUID = user?.uuid
    if (!service) return
    localStorage.setItem(
      'servicePaymentReturnUrl',
      `${window.location.pathname}${window.location.search}`,
    )
    const currentUrl = `${window.location.origin}/service-payment-success`
    const cancelUrl = window.location.href
    try {
      const token = getTokenFromCookie()
      const uid = userUUID || currentuserUUID

      if (!uid) {
        alert('User not found. Please login.')
        return
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/services/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            userUUID: uid || currentuserUUID,
            service,
            price: totalPrice,
            success_url: currentUrl,
            cancel_url: cancelUrl,
          }),
        }
      )
      const data = await response.json()
      if (response.status === 201 && data.url) {
        window.location.href = data.url
        setIsOpenModal(false)
      } else {
        alert(data?.message || 'Payment initiation failed.')
      }
    } catch (error) {
      console.error('Error initiating checkout:', error)
      alert('Error initiating payment. Please try again.')
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-[12px] shadow-lg w-96'>
        <h2 className='text-lg text-[#8D7C3B] font-semibold mb-4'>
          Confirmation Modal
        </h2>

        {has3D && (
          <>
            <p>You have Requested 3Dwalkthrough</p>
            <p>3D Walkthrough Price: {modalData?.price}</p>
          </>
        )}

        {hasTechnical && (
          <>
            <p>You have Requested Technical Report</p>
            <p>Technical Report Price: {technicalModalData?.price}</p>
          </>
        )}

        {has3D && hasTechnical && (
          <>
            <p>You have Requested 3Dwalkthrough and Technical Report</p>
            <p>Total Price: {totalPrice}</p>
          </>
        )}

        <div className='flex justify-end mt-6'>
          <button
            onClick={() => setIsOpenModal(false)}
            className='mr-4 px-4 py-2 bg-gray-200 text-gray-800 rounded'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handlePay}
            className='px-4 py-2 bg-[#8D7C3B] text-white rounded'
            disabled={!service}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default PayModal
