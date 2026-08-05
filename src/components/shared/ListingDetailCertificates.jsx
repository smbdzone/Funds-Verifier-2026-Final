'use client'

import { useState } from 'react'
import Modal from '@/components/product-modal/modal'
import Modal2 from '@/components/product-modal/modal2'
import Open3dModal from '@/components/3dModal/Open3dModal'
import {
  getListingDocumentSrc,
  getTechnicalReportSrc,
} from '@/libs/listingCardMedia'

/**
 * Detail-page icons for uploaded evaluation certificate, technical report,
 * and paid 3D walkthrough — only renders when each asset exists.
 */
export default function ListingDetailCertificates({ listing }) {
  const [isTechnicalOpen, setIsTechnicalOpen] = useState(false)
  const [isEvalOpen, setIsEvalOpen] = useState(false)
  const [is3dOpen, setIs3dOpen] = useState(false)

  const technicalReportSrc = getTechnicalReportSrc(listing?.technicalReport)
  const evaluationCertificateSrc = getListingDocumentSrc(
    listing?.evaluationCertificate,
  )
  const walkthroughLink = listing?.video3DWalkthrough?.link

  if (!technicalReportSrc && !evaluationCertificateSrc && !walkthroughLink) {
    return null
  }

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {technicalReportSrc ? (
        <>
          <button
            type='button'
            className='relative rounded bg-[#E0E0E0] p-1'
            title='Technical report'
            aria-label='View technical report'
            onClick={() => setIsTechnicalOpen(true)}
          >
            <img
              src='/icons/card1.png'
              className='h-[23px] w-[23px] cursor-pointer'
              alt='Technical report'
            />
          </button>
          <Modal
            isOpen={isTechnicalOpen}
            onClose={() => setIsTechnicalOpen(false)}
            fileUrl={technicalReportSrc}
          />
        </>
      ) : null}

      {evaluationCertificateSrc ? (
        <>
          <button
            type='button'
            className='relative rounded bg-[#E0E0E0] p-1'
            title='Evaluation certificate'
            aria-label='View evaluation certificate'
            onClick={() => setIsEvalOpen(true)}
          >
            <img
              src='/icons/card2.png'
              className='h-[23px] w-[23px] cursor-pointer'
              alt='Evaluation certificate'
            />
          </button>
          <Modal2
            isOpen={isEvalOpen}
            onClose={() => setIsEvalOpen(false)}
            file2Url={evaluationCertificateSrc}
            downloadFileName={
              listing?.evaluationCertificate?.Certificate?.name
            }
            modalTitle='Evaluation Certificate'
          />
        </>
      ) : null}

      {walkthroughLink ? (
        <>
          <button
            type='button'
            className='relative rounded bg-[#E0E0E0] p-1'
            title='3D Walkthrough'
            aria-label='View 3D walkthrough'
            onClick={() => setIs3dOpen(true)}
          >
            <img
              src='/icons/3dicon.png'
              className='h-[23px] w-[23px] cursor-pointer'
              alt='3D Walkthrough'
            />
          </button>
          {is3dOpen ? (
            <Open3dModal
              selectedMedia={is3dOpen}
              setSelectedMedia={setIs3dOpen}
              link={walkthroughLink}
            />
          ) : null}
        </>
      ) : null}
    </div>
  )
}
