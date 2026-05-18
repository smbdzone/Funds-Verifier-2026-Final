'use client'
import { ProfileTab } from '@/components/modules/Profile/ProfileTab'
import { Suspense, useEffect, useState } from 'react'
import TermsAndConditionsModal from '../../../components/modal/TermsAndConditionsModal'
import { useProfile } from '../../../context/UserContext'

export default function Home() {
  const [consentTerms, setConsentTerms] = useState(false)
  const { user } = useProfile()

  useEffect(() => {
    // Set a timer to show the newsletter modal after 5 seconds
    const timer = setTimeout(() => {
      setConsentTerms(true)
    }, 1000)

    // Cleanup the timer when the component is unmounted
    return () => clearTimeout(timer)
  }, [])
  return (
    <>
      <ProfileTab />
      {user?.userState === 'inactive' ? (
        <TermsAndConditionsModal
          show={consentTerms}
          onClose={() => setConsentTerms(false)}
        />
      ) : null}
    </>
  )
}
