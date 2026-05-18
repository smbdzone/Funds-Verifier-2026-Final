// /* eslint-disable react-hooks/rules-of-hooks */
// 'use client'
// import { useEffect, useState } from 'react'
// import { useProfile } from '../../../context/UserContext'
// import TermsAndConditionModal2 from '../../../components/modal/TermsAndConditionModal2'
// import EditProfile from '@/components/modules/SellerProfile/Profile/EditProfile'
// import { FaSpinner } from 'react-icons/fa'

// const Page = () => {
//   const [consentTerms, setConsentTerms] = useState(false)
//   const [countries, setCountries] = useState([])
//   const { user, fetchProfile } = useProfile()

//   // ⚡ Load profile & countries WITHOUT blocking UI
//   useEffect(() => {
//     // fetchProfile() // no await
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

//   // ⚡ Show modal 1 second later
//   useEffect(() => {
//     const timer = setTimeout(() => setConsentTerms(true), 1000)
//     return () => clearTimeout(timer)
//   }, [])

//   return (
//     <>
//       {/* {!user || countries?.length === 0 ? (
//         <div className='w-full h-40 flex justify-center items-center'>
//           <FaSpinner className='animate-spin' />
//         </div>
//       ) : (
//         <EditProfile user={user} countries={countries} />
//       )} */}

//       {user?.userState === 'inactive' && (
//         <TermsAndConditionModal2
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
import TermsAndConditionModal2 from '../../../components/modal/TermsAndConditionModal2'
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
        await fetchProfile()

        const response = await fetch('/api/countries')
        const data = await response.json()

        setCountries(normalizeCountriesResponse(data))
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Modal delay
  useEffect(() => {
    const timer = setTimeout(() => setConsentTerms(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  // ✅ Proper loading guard
  if (loading) {
    return (
      <div className='w-full h-40 flex justify-center items-center'>
        <FaSpinner className='animate-spin' />
      </div>
    )
  }

  return (
    <>
      {/* ✅ Only render when BOTH are ready */}
      {user && (
        <EditProfile user={user} countries={countries} />
      )}

      {/* ✅ Extra safety */}
      {user && user.userState === 'inactive' && (
        <TermsAndConditionModal2
          show={consentTerms}
          onClose={() => setConsentTerms(false)}
        />
      )}
    </>
  )
}

export default Page