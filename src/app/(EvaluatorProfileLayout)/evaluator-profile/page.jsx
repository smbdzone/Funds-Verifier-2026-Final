// /* eslint-disable react-hooks/rules-of-hooks */
// 'use client'

// import { useEffect, useState } from 'react'
// import { useProfile } from '../../../context/UserContext'
// import TermsAndConditionModal3 from '../../../components/modal/TermsAndConditionModal3'
// import EditProfile from '@/components/modules/SellerProfile/Profile/EditProfile'

// const Page = () => {
//   const [consentTerms, setConsentTerms] = useState(false)
//   const [countries, setCountries] = useState([])
//   const { user, fetchProfile } = useProfile()

//   // ⚡ Fetch profile & countries WITHOUT blocking UI
//   useEffect(() => {
//     fetchProfile() // no await
//     fetchCountries() // no await
//   }, [])

//   const fetchCountries = async () => {
//     try {
//       const response = await fetch('/api/countries')
//       const data = await response.json()
//       setCountries(data)
//     } catch (error) {
//       console.error('Error fetching countries data:', error)
//     }
//   }

//   // ⚡ Show modal after 1 second
//   useEffect(() => {
//     const timer = setTimeout(() => setConsentTerms(true), 1000)
//     return () => clearTimeout(timer)
//   }, [])

//   return (
//     <>
//       <EditProfile user={user} countries={countries} />

//       {user?.userState === 'inactive' && (
//         <TermsAndConditionModal3
//           show={consentTerms}
//           onClose={() => setConsentTerms(false)}
//         />
//       )}
//     </>
//   )
// }

// export default Page
'use client'

import { useEffect, useState } from 'react'
import { useProfile } from '../../../context/UserContext'
import TermsAndConditionModal3 from '../../../components/modal/TermsAndConditionModal3'
import EditProfile from '@/components/modules/SellerProfile/Profile/EditProfile'
import { FaSpinner } from 'react-icons/fa'
import { normalizeCountriesResponse } from '@/libs/normalizeCountriesResponse'

const Page = () => {
  const [consentTerms, setConsentTerms] = useState(false)
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)

  const { user, fetchProfile } = useProfile()

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchProfile(), fetchCountries()])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const fetchCountries = async () => {
    try {
      const res = await fetch('/api/countries')
      const data = await res.json()
      setCountries(normalizeCountriesResponse(data))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setConsentTerms(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className='w-full h-40 flex justify-center items-center'>
        <FaSpinner className='animate-spin' />
      </div>
    )
  }

  return (
    <>
      {user && <EditProfile user={user} countries={countries} />}

      {user?.userState === 'inactive' && (
        <TermsAndConditionModal3
          show={consentTerms}
          onClose={() => setConsentTerms(false)}
        />
      )}
    </>
  )
}

export default Page
