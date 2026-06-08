import { useState } from 'react'
import { useProfile } from '../../context/UserContext'
import { initiateServiceSubscription } from '@/libs/initiateServiceSubscription'
import { initiateClozerPayment, getClozerErrorMessage } from '@/libs/initiateClozerPayment'
import PaymentChoiceModal from '@/components/payments/PaymentChoiceModal'
import { applyFullPayDiscount } from '@/libs/paymentDiscount'
import { toast } from 'react-toastify'

const PayModal = ({
  modalData,
  technicalModalData,
  setIsOpenModal,
  userUUID,
}) => {
  const { user } = useProfile()
  const [loading, setLoading] = useState(false)

  const has3D = !!modalData?.price
  const hasTechnical = !!technicalModalData?.price
  let service = null
  if (has3D && hasTechnical) service = 'all'
  else if (has3D) service = '_3dwalkthrough'
  else if (hasTechnical) service = 'surveyor'

  const totalPrice =
    Number(modalData.price || 0) + Number(technicalModalData.price || 0)

  const buildSubscriptionPayload = () => {
    const currentuserUUID = user?.uuid
    const uid = userUUID || currentuserUUID
    const source = modalData?.productId ? modalData : technicalModalData

    return {
      uid,
      payload: {
        userUUID: uid,
        service,
        price: totalPrice,
        success_url: `${window.location.origin}/service-payment-success`,
        cancel_url: window.location.href,
        assetType:
          source?.assetType ||
          modalData?.assetType ||
          technicalModalData?.assetType,
        productId:
          source?.productId ||
          modalData?.productId ||
          technicalModalData?.productId,
        productTitle:
          source?.productTitle ||
          modalData?.productTitle ||
          technicalModalData?.productTitle,
        phone:
          source?.phone ||
          modalData?.phone ||
          technicalModalData?.phone ||
          '',
        dateTime:
          source?.dateTime ||
          modalData?.dateTime ||
          technicalModalData?.dateTime ||
          '',
        category:
          source?.category ||
          modalData?.category ||
          technicalModalData?.category,
        subCategory:
          source?.subCategory ||
          modalData?.subCategory ||
          technicalModalData?.subCategory,
        value:
          source?.value ?? modalData?.value ?? technicalModalData?.value,
      },
    }
  }

  const handleStripePay = async () => {
    const { uid, payload } = buildSubscriptionPayload()
    if (!service || !uid) {
      toast.error('User not found. Please login.')
      return
    }

    try {
      setLoading(true)
      localStorage.setItem(
        'servicePaymentReturnUrl',
        `${window.location.pathname}${window.location.search}`,
      )

      const data = await initiateServiceSubscription({
        ...payload,
        price: applyFullPayDiscount(totalPrice).discounted,
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
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        'Error initiating payment. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClozerPay = async () => {
    const { uid, payload } = buildSubscriptionPayload()
    if (!service || !uid) {
      toast.error('User not found. Please login.')
      return
    }

    try {
      setLoading(true)
      localStorage.setItem(
        'servicePaymentReturnUrl',
        `${window.location.pathname}${window.location.search}`,
      )

      const data = await initiateClozerPayment({
        ...payload,
        success_url: `${window.location.origin}/clozer-return`,
      })

      if (data?.redirectUrl) {
        localStorage.setItem('clozerTransactionId', data.transaction_id)
        window.location.href = data.redirectUrl
        setIsOpenModal(false)
      } else {
        toast.error(data?.message || 'Installment payment could not be started.')
      }
    } catch (error) {
      toast.error(getClozerErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-[12px] shadow-lg w-full max-w-md relative'>
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

        <PaymentChoiceModal
          show
          onClose={() => setIsOpenModal(false)}
          amount={totalPrice}
          loading={loading}
          onPayFull={handleStripePay}
          onPayInstallments={handleClozerPay}
        />
      </div>
    </div>
  )
}

export default PayModal
