'use client'

import { useState } from 'react'
import Modal2 from '@/components/product-modal/modal2'
import Open3dModal from '@/components/3dModal/Open3dModal'
import {
  getListingDocumentSrc,
  getTechnicalReportSrc,
} from '@/libs/listingCardMedia'
import { getListingWalkthroughUrl } from '@/libs/listingPremiumStatus'

/**
 * Certificate / report / 3D icons for listing cards.
 * Renders only the assets that exist on the listing.
 */
export default function ListingCardCertificates({
  listing,
  className = '',
  iconWrapClassName = 'rounded bg-[#E0E0E0] p-1',
}) {
  const [isEvalOpen, setIsEvalOpen] = useState(false)
  const [isTechnicalOpen, setIsTechnicalOpen] = useState(false)
  const [is3dOpen, setIs3dOpen] = useState(false)

  const evaluationCertificate = listing?.evaluationCertificate
  const technicalReport = listing?.technicalReport
  const evaluationCertificateSrc = getListingDocumentSrc(evaluationCertificate)
  const technicalReportSrc = getTechnicalReportSrc(technicalReport)
  const walkthroughUrl = getListingWalkthroughUrl(listing)

  if (!evaluationCertificateSrc && !technicalReportSrc && !walkthroughUrl) {
    return null
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {evaluationCertificateSrc ? (
        <>
          <button
            type='button'
            className={`relative group/cert ${iconWrapClassName}`}
            title='Evaluation Certificate'
            aria-label='View evaluation certificate'
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsEvalOpen(true)
            }}
          >
            <img
              src='/icons/card2.png'
              className='h-[23px] w-[23px] cursor-pointer'
              alt='Evaluation certificate'
            />
            <span className='pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-white px-2 py-1 text-xs text-black opacity-0 shadow-lg transition-opacity group-hover/cert:opacity-100'>
              Evaluation Certificate
            </span>
          </button>
          <Modal2
            isOpen={isEvalOpen}
            onClose={() => setIsEvalOpen(false)}
            file2Url={evaluationCertificateSrc}
            downloadFileName={evaluationCertificate?.Certificate?.name}
            modalTitle='Evaluation Certificate'
          />
        </>
      ) : null}

      {technicalReportSrc ? (
        <>
          <button
            type='button'
            className={`relative group/cert ${iconWrapClassName}`}
            title='Technical Report'
            aria-label='View technical report'
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsTechnicalOpen(true)
            }}
          >
            <img
              src='/icons/card1.png'
              className='h-[23px] w-[23px] cursor-pointer'
              alt='Technical report'
            />
            <span className='pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-white px-2 py-1 text-xs text-black opacity-0 shadow-lg transition-opacity group-hover/cert:opacity-100'>
              Technical Report
            </span>
          </button>
          <Modal2
            isOpen={isTechnicalOpen}
            onClose={() => setIsTechnicalOpen(false)}
            file2Url={technicalReportSrc}
            downloadFileName={
              technicalReport?.reportFile?.Certificate?.name ||
              'technical-report.pdf'
            }
            modalTitle='Technical Report'
          />
        </>
      ) : null}

      {walkthroughUrl ? (
        <>
          <button
            type='button'
            className={`relative group/cert ${iconWrapClassName}`}
            title='3D Walkthrough'
            aria-label='View 3D walkthrough'
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIs3dOpen(true)
            }}
          >
            <img
              src='/icons/3dicon.png'
              className='h-[23px] w-[23px] cursor-pointer'
              alt='3D Walkthrough'
            />
            <span className='pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-white px-2 py-1 text-xs text-black opacity-0 shadow-lg transition-opacity group-hover/cert:opacity-100'>
              3D Walkthrough
            </span>
          </button>
          {is3dOpen ? (
            <Open3dModal
              selectedMedia={is3dOpen}
              setSelectedMedia={setIs3dOpen}
              link={walkthroughUrl}
            />
          ) : null}
        </>
      ) : null}
    </div>
  )
}
