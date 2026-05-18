'use client'
import React, { useState } from 'react'
import ListingCard from '../../../cards/ListingCard' // adjust path if needed

export const EvaluationList = ({ listings }) => {
  const [loading, setLoading] = useState(false)

  // Dummy delete handler to satisfy ListingCard prop

  console.clear()
  return (
    <div className='w-full'>
      <span className='lg:text-3xl sm:text-xl text-lg text-black mb-4 block'>
        My Listings
      </span>
      <span className='lg:text-xl sm:text-lg text-sm text-black font-bold mb-4 block'>
        Pending Evaluations
      </span>

      {loading ? (
        <p>Loading pending evaluations...</p>
      ) : (
        <ListingCard listings={listings} usePendingEvaluation={true} />
      )}
    </div>
  )
}
