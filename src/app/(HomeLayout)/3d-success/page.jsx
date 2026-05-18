'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import axios from 'axios'

const PaymentConfirmation = () => {
  const searchParams = useSearchParams()
  const session_id = searchParams.get('session_id')
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [data, setData] = useState(null)

  // Fetch payment details and update the localStorage with payment method
  useEffect(() => {
    if (session_id) {
      axios
        .get(`/api/3d-walkthrough?session_id=${session_id}`)
        .then((response) => {
          const paymentData = response.data

          // Add payment status to the retrieved localStorage data
          const updatedData = {
            ...data,
            payment_method_status: paymentData.payment_status,
            payment_details: paymentData,
          }

          setPaymentDetails(paymentData)
          // Store the updated data back to localStorage
          localStorage.setItem('3Dwalkthrough', JSON.stringify(updatedData))
        })
        .catch((error) => console.error('Error fetching session:', error))
    }
  }, [session_id])

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

// Wrap it in Suspense in the main component
const Page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PaymentConfirmation />
    </Suspense>
  )
}

export default Page
