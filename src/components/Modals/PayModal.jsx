import { useProfile } from '../../context/UserContext'
import { initiateServiceSubscription } from '@/libs/initiateServiceSubscription'
import { toast } from 'react-toastify'

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
      const uid = userUUID || currentuserUUID

      if (!uid) {
        toast.error('User not found. Please login.')
        return
      }

      const source = modalData?.productId ? modalData : technicalModalData
      const data = await initiateServiceSubscription({
        userUUID: uid,
        service,
        price: totalPrice,
        success_url: currentUrl,
        cancel_url: cancelUrl,
        assetType: source?.assetType || modalData?.assetType || technicalModalData?.assetType,
        productId: source?.productId || modalData?.productId || technicalModalData?.productId,
        productTitle: source?.productTitle || modalData?.productTitle || technicalModalData?.productTitle,
        phone: source?.phone || modalData?.phone || technicalModalData?.phone || '',
        dateTime: source?.dateTime || modalData?.dateTime || technicalModalData?.dateTime || '',
        category: source?.category || modalData?.category || technicalModalData?.category,
        subCategory: source?.subCategory || modalData?.subCategory || technicalModalData?.subCategory,
        value: source?.value ?? modalData?.value ?? technicalModalData?.value,
      })

      if (data?.url) {
        if (data.sessionId) {
          localStorage.setItem('checkoutSessionId', data.sessionId)
        }
        window.location.href = data.url
        setIsOpenModal(false)
      } else {
        toast.error(data?.message || 'Payment initiation failed.')
      }
    } catch (error) {
      console.error('Error initiating checkout:', error)
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        'Error initiating payment. Please try again.',
      )
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
