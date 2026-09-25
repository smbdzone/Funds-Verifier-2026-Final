'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import PrivateListingRequestModal from '@/components/shared/PrivateListingRequestModal'

const PrivateListingRequestContext = createContext(null)

export function PrivateListingRequestProvider({ children }) {
  const [listing, setListing] = useState(null)

  const openRequest = useCallback((nextListing) => {
    setListing(nextListing || null)
  }, [])

  const closeRequest = useCallback(() => {
    setListing(null)
  }, [])

  const value = useMemo(
    () => ({ openRequest, closeRequest }),
    [openRequest, closeRequest],
  )

  return (
    <PrivateListingRequestContext.Provider value={value}>
      {children}
      <PrivateListingRequestModal listing={listing} onClose={closeRequest} />
    </PrivateListingRequestContext.Provider>
  )
}

export function usePrivateListingRequest() {
  const context = useContext(PrivateListingRequestContext)
  if (!context) {
    return {
      openRequest: () => {},
      closeRequest: () => {},
    }
  }
  return context
}
