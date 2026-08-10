'use client'

import { useEffect, useState } from 'react'

const GOLD_GRADIENT =
  '[background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)]'
const TWO_STEP = 2
const THREE_STEP = 3

/**
 * Same related-grid behaviour as Off-Plan:
 * mobile &lt;700: 1 card + top pagination
 * 700–1279: 2 full-width cards + See more
 * 1280+: 3 cards + See more
 */
export default function RelatedListingsSection({
  title = 'Related Listings',
  listings = [],
  getKey = (item, index) => item?.uuid || item?.slug || item?.id || index,
  renderCard,
}) {
  const [mobileIndex, setMobileIndex] = useState(0)
  const [twoVisible, setTwoVisible] = useState(TWO_STEP)
  const [threeVisible, setThreeVisible] = useState(THREE_STEP)

  useEffect(() => {
    setMobileIndex(0)
    setTwoVisible(TWO_STEP)
    setThreeVisible(THREE_STEP)
  }, [listings])

  if (!listings.length || typeof renderCard !== 'function') return null

  const mobileCard = listings[mobileIndex]
  const canPrev = mobileIndex > 0
  const canNext = mobileIndex < listings.length - 1
  const twoData = listings.slice(0, twoVisible)
  const hasMoreTwo = twoVisible < listings.length
  const threeData = listings.slice(0, threeVisible)
  const hasMoreThree = threeVisible < listings.length

  return (
    <div className='mt-8 w-full border-t border-reefGold px-4 pb-10 pt-10 sm:mt-12 sm:px-6 sm:pt-12 md:px-8 lg:px-10 xl:px-12'>
      <h2 className='mb-4 text-left text-lg font-semibold text-blue min-[700px]:mb-6 md:text-2xl'>
        {title}
      </h2>

      <div className='min-[700px]:hidden'>
        {listings.length > 1 ? (
          <div className='mb-3 flex items-center justify-center gap-3'>
            <button
              type='button'
              onClick={() => setMobileIndex((prev) => prev - 1)}
              disabled={!canPrev}
              className={`flex h-8 w-8 items-center justify-center rounded-sm disabled:cursor-not-allowed disabled:opacity-40 ${GOLD_GRADIENT}`}
              aria-label='Previous listing'
            >
              <img
                src='/icons/golden-arrow-previous.png'
                alt=''
                className='h-2.5 w-2.5'
              />
            </button>
            <span className='text-sm font-medium text-prussianBlue'>
              {mobileIndex + 1} / {listings.length}
            </span>
            <button
              type='button'
              onClick={() => setMobileIndex((prev) => prev + 1)}
              disabled={!canNext}
              className={`flex h-8 w-8 items-center justify-center rounded-sm disabled:cursor-not-allowed disabled:opacity-40 ${GOLD_GRADIENT}`}
              aria-label='Next listing'
            >
              <img
                src='/icons/golden-arrow-previous.png'
                alt=''
                className='h-2.5 w-2.5 rotate-180'
              />
            </button>
          </div>
        ) : null}

        {mobileCard ? (
          <div className='mx-auto w-full max-w-[360px]'>
            {renderCard(mobileCard)}
          </div>
        ) : null}
      </div>

      <div className='hidden w-full grid-cols-2 items-stretch justify-items-stretch gap-5 min-[700px]:grid xl:hidden min-[700px]:gap-6 lg:gap-8'>
        {twoData.map((listing, index) => (
          <div key={getKey(listing, index)} className='flex h-full w-full min-h-0'>
            {renderCard(listing)}
          </div>
        ))}
      </div>

      {hasMoreTwo ? (
        <div className='mt-8 hidden justify-center min-[700px]:flex xl:hidden'>
          <button
            type='button'
            onClick={() =>
              setTwoVisible((count) =>
                Math.min(count + TWO_STEP, listings.length),
              )
            }
            className={`inline-flex h-10 min-w-[140px] items-center justify-center rounded-sm px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 ${GOLD_GRADIENT}`}
          >
            See more
          </button>
        </div>
      ) : null}

      <div className='hidden w-full items-stretch justify-items-stretch gap-6 xl:grid xl:grid-cols-3 xl:gap-8'>
        {threeData.map((listing, index) => (
          <div key={getKey(listing, index)} className='flex h-full w-full min-h-0'>
            {renderCard(listing)}
          </div>
        ))}
      </div>

      {hasMoreThree ? (
        <div className='mt-8 hidden justify-center xl:flex'>
          <button
            type='button'
            onClick={() =>
              setThreeVisible((count) =>
                Math.min(count + THREE_STEP, listings.length),
              )
            }
            className={`inline-flex h-11 min-w-[160px] items-center justify-center rounded-sm px-6 text-[18px] font-medium text-white transition-opacity hover:opacity-90 ${GOLD_GRADIENT}`}
          >
            See more
          </button>
        </div>
      ) : null}
    </div>
  )
}
