/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FormCheck2 from '@/components/CheckBoxComponent/FormCheck2'
import { toast } from 'react-toastify'
import { useProfile } from '../../context/UserContext'
import customAxios from '../../utils/apis/apis'

const TermsAndConditionModal2 = ({ show, onClose }) => {
  const [consentData, setConsentData] = useState({
    consentTerms: false,
    consentTaxTerms: false,
  })
  const { user, setUser, fetchProfile } = useProfile()

  const handleChange = (e) => {
    const { name, checked } = e.target
    setConsentData((prevData) => ({
      ...prevData,
      [name]: checked,
    }))
  }

  const handleSave = async () => {
    if (consentData?.consentTaxTerms && consentData.consentTerms) {
      try {
        const res = await customAxios.put(`/user/update/${user?.uuid}`, {
          electronicConsent: consentData,
          userState: 'active',
        })
        if (res?.status === 200) {
          onClose()
          setUser(res?.data)
          toast.success(
            'Thanks for agreeing to the terms. Enjoy exploring our platform!',
          )
          fetchProfile()
        }
      } catch (error) {
        console.error(error.message)
        toast.error(error?.message)
      }
    } else {
      toast.error('Please agree to both terms to continue to website')
    }
  }

  const springAnimation = {
    type: 'spring',
    stiffness: 70,
    damping: 10,
  }

  if (!show) {
    return null
  }

  return (
    <AnimatePresence>
      z
      <div className='fixed inset-0 bg-black/10 bg-opacity-30 flex justify-center items-center z-50 p-4'>
        <motion.div
          className='relative bg-white shadow- mt-5 rounded-lg py-10 md:px-8 w-[350px] overflow-y-auto overflow-hidden lg:w-[800px] md:w-[700px] h-[80%] z-50'
          initial={{ y: '-100vh', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100vh', opacity: 0 }}
          transition={springAnimation}
        >
          <button
            type='button'
            className='absolute text-lg text-black top-4 right-4'
            onClick={onClose}
          >
            x
          </button>
          <div className='md:flex '>
            <div className='w-full'>
              <div className='px-6 py-4'>
                <span className='sm:text-base text-sm lg:text-lg text-prussianBlue/40 mb-4 block'>
                  Electronic Consent
                </span>
                <div className='custom-shadow rounded flex flex-col gap-2'>
                  <>
                    <div className='custom-shadow rounded'>
                      <div className='primary-gradient rounded md:px-12 px-4 overflow-x-auto'>
                        <nav
                          className='flex justify-between gap-3 w-full'
                          aria-label='Tabs'
                        >
                          <button
                            className={`whitespace-nowrap py-4 cursor-pointersm:text-base text-sm lg:text-lg`}
                          >
                            My Profile
                          </button>
                        </nav>
                      </div>
                    </div>
                    <div className='gap-4 md:px-8 px-4 py-6'>
                      <p className='md:text-base text-sm mb-5 md:mb-10'>
                        Thank you for taking the time to review and accept our
                        terms and conditions. Your agreement allows us to
                        provide you with the best possible experience while
                        ensuring transparency and mutual understanding. We are
                        committed to maintaining your trust and delivering
                        services that align with your expectations. Should you
                        have any questions or require assistance, please do not
                        hesitate to reach out to us. We appreciate your trust
                        and look forward to serving you!
                      </p>
                      {user?.electronicConsent?.consentTerms &&
                      user?.electronicConsent?.consentTaxTerms &&
                      user?.userState === 'active' ? (
                        <p className='text-center md:text-base text-sm'>
                          Hi
                          <span className='font-semibold ml-1'>
                            {user?.displayName || user?.name}
                          </span>
                          , you’ve already accepted our terms and conditions.
                          Thank you!
                        </p>
                      ) : (
                        <>
                          <p className='md:text-base text-sm mb-5 md:mb-10'>
                            "By continuing to use our platform, you indicate
                            your acceptance of our terms and conditions. Before
                            continuing, kindly review our terms and conditions
                            document thoroughly. Furthermore, if any transaction
                            entails cross-border purchases that require
                            notification to relevant tax authorities, it is
                            incumbent upon you to provide them with the
                            appropriate information. Neglecting to do so could
                            potentially lead to legal ramifications. By
                            selecting the following boxes, you indicate your
                            acceptance of the following terms:"
                          </p>
                          <div className='mb-5 ps-5 flex flex-col gap-2 items-start py-3 font-medium'>
                            <FormCheck2
                              id='1'
                              label='I agree to abide by the terms and conditions of this transaction.'
                              name='consentTerms'
                              checked={consentData.consentTerms}
                              onChange={handleChange}
                              className=''
                            />
                            <FormCheck2
                              id='2'
                              label='I acknowledge that if this transaction involves cross-border purchases, it is my responsibility to notify the relevant tax authorities, and I accept accountability for any consequences resulting from failure to do so.'
                              name='consentTaxTerms'
                              checked={consentData.consentTaxTerms}
                              onChange={handleChange}
                            />
                          </div>
                          <div className='custom-shadow px-5 py-3 flex gap-2'>
                            <div className='flex justify-center items-center h-3 w-3 shrink-0 border border-darkGray mt-1'>
                              <span className='bg-black h-[6px] w-[6px]'></span>
                            </div>
                            <p className='md:text-base text-sm'>
                              "Note: Failure to check both boxes will result in
                              the inability to use our platform for this
                              transaction. Please ensure both boxes are checked
                              before proceeding."
                            </p>
                          </div>
                          <div className='flex justify-end gap-3 md:me-10 my-3'>
                            <button
                              onClick={handleSave}
                              className='flex text-white justify-center primary-gradient border-0 py-2 md:px-10 px-4 focus:outline-none text-lg font-medium rounded'
                            >
                              Accept
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default TermsAndConditionModal2
