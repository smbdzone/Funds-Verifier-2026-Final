'use client'
import Image from 'next/image'

/**
 * UAE Pass sign-in / signup for the advertiser flow.
 *
 * UAE Pass has a single fixed callback (the home page). Before redirecting out,
 * we stash two hints in localStorage that the callback (components/home/Login.jsx)
 * reads back:
 *   - uaePassSignupRole = 'Advertiser'  -> new accounts are created as advertisers
 *   - postLoginRedirect = '/advertiser-dashboard' -> land on the ad dashboard after auth
 */
const AdvertiserUaePassButton = () => {
  const handleLogin = () => {
    try {
      localStorage.setItem('uaePassSignupRole', 'Advertiser')
      localStorage.setItem('postLoginRedirect', '/advertiser-dashboard')
    } catch {}

    const authUrl = `https://id.uaepass.ae/idshub/authorize?redirect_uri=${process.env.NEXT_PUBLIC_UAE_PASS_REDIRECT_URI}/&client_id=${process.env.NEXT_PUBLIC_UAE_PASS_CLIENT_ID}&response_type=code&scope=urn:uae:digitalid:profile:general&acr_values=urn:safelayer:tws:policies:authentication:level:low;`
    window.location.href = authUrl
  }

  return (
    <button
      onClick={handleLogin}
      className='w-full bg-white hover:bg-[#8D7C3B] hover:bg-opacity-[0.2] transition duration-300 ease-in-out border-[1.5px] rounded-md my-3 border-[rgba(162,145,62,1)] justify-center flex flex-row gap-2 p-2 items-center'
    >
      <Image
        src='/assets/images/buttonUaePass.png'
        alt='Sign in with UAE PASS'
        width={180}
        height={25}
        quality={90}
      />
    </button>
  )
}

export default AdvertiserUaePassButton
