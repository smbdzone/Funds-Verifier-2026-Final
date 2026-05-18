'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import axios from 'axios'
import { useProfile } from '../../../context/UserContext'
import customAxios from '../../../utils/apis/apis'

const SuccessComponent = () => {
  const searchParams = useSearchParams()
  const session_id = searchParams.get('session_id')
  const productId = searchParams.get('id')
  const assetType = searchParams.get('assetType')
  const { user } = useProfile()
  const [paymentDetails, setPaymentDetails] = useState(null)

  const handleUpdatedata = async (id) => {
    try {
      let endpoint = ''

      switch (assetType) {
        case 'Property For Lease':
        case 'Property For Sale':
        case 'Property Off Plan For Sale':
          endpoint = `/property/${productId}`
          break
        case 'Car For Sale':
          endpoint = `/car/${productId}`
          break
        case 'Jewellery For Sale':
          endpoint = `/jewelry/${productId}`
          break
        case 'Boats For Sale':
          endpoint = `/boat/${productId}`
          break
        default:
          console.error('Unknown asset type:', assetType)
          return
      }

      const response = await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
        { transactionId: id, dealhunterId: user?.uuid }
      )

      if (response.status === 200) {
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
    }
  }

  const postDetails = async (updatedData) => {
    try {
      const res = await customAxios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/pay`,
        {
          ...updatedData,
        }
      )

      if (res?.status === 201) {
        handleUpdatedata(res?.data?.transaction.uuid)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Deal purchase flow only (has product id). Service payments use /service-payment-success.
  useEffect(() => {
    if (!session_id) return

    if (!productId) {
      window.location.replace(
        `/service-payment-success?session_id=${encodeURIComponent(session_id)}`,
      )
      return
    }

    axios
      .get(`/api/stripe-checkout?session_id=${session_id}`)
      .then((response) => {
        const paymentData = response.data
        const updatedData = {
          payment_method_status: paymentData.payment_status,
          payment_details: paymentData,
        }
        setPaymentDetails(paymentData)
        postDetails(updatedData)
      })
      .catch((error) => {
        console.error('Error fetching session:', error)
        window.location.replace(
          `/service-payment-success?session_id=${encodeURIComponent(session_id)}`,
        )
      })
  }, [session_id, user, productId])

  if (!paymentDetails) return <p>Loading payment details...</p>

  return (
    <div className='flex flex-col h-[80vh] gap-4 items-center text-center justify-center'>
      <h1 className='text-blue capitalize text-center text-[40px] font-bold'>
        Payment Confirmation
      </h1>
      <p>
        You are receiving a confirmation of successful payment and delivery
        details.
      </p>
      <div>
        <h1>Payment Successful!</h1>
        <p>Payment Status: {paymentDetails.payment_status}</p>
        <p>Amount Paid: ${paymentDetails.amount_total / 100}</p>
      </div>
    </div>
  )
}
const Page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SuccessComponent />
    </Suspense>
  )
}
export default Page
