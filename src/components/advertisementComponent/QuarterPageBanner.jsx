'use client'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  getTokenFromCookie,
  getFromLocalStorage,
  saveToLocalStorage,
} from '@/utils/helper'
import { GetUserIpAddress } from '@/utils/localization/GetUserLocalization'
import { useProfile } from '@/context/UserContext'

const ROOT = `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement`
const AD_WIDTH = 1080
const AD_HEIGHT = 395

const todayKey = () => new Date().toISOString().slice(0, 10)

/**
 * Quarter-Page Banner shown on listing pages to EVERY visitor.
 * Logged-in viewers get an approved, targeted banner (matched by the viewer's
 * city / age-group / gender); logged-out visitors get untargeted ads only,
 * since there's no profile to match them against.
 * Impressions/clicks are only recorded for logged-in viewers — anonymous views
 * are displayed but never billed to the advertiser. Per-creative/day
 * localStorage de-dup avoids re-billing the same creative while browsing.
 */
const QuarterPageBanner = ({ className = '' }) => {
  const user = useProfile()
  const [ad, setAd] = useState(null)
  const containerRef = useRef(null)

  const token = getTokenFromCookie() || user?.accessToken || null

  const alreadyDone = (key, creativeId) => {
    const map = getFromLocalStorage(key) || {}
    return map[creativeId] === todayKey()
  }
  const markDone = (key, creativeId) => {
    const map = getFromLocalStorage(key) || {}
    map[creativeId] = todayKey()
    saveToLocalStorage(key, map)
  }

  // Fetch a banner. The endpoint is public: sending a token unlocks targeted
  // ads, omitting one returns untargeted ads.
  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await axios.get(`${ROOT}/getAllLargeBanners`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const doc = res?.data?.data?.[0]
        const creative = doc?.creatives?.[0]
        if (!active) return
        if (creative) {
          setAd({
            advertisementId: doc._id,
            creativeId: creative._id,
            img: creative.signedImg || creative.img?.url || creative.img,
            adLink: creative.adLink,
          })
        } else {
          setAd(null)
        }
      } catch {
        if (active) setAd(null)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [token])

  // Fire an impression when the banner scrolls into view. Billing is tied to a
  // user account, so anonymous views are deliberately not recorded.
  useEffect(() => {
    if (!ad || !token) return
    const el = containerRef.current
    if (!el) return

    let fired = false
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (!entry.isIntersecting || fired) return
          fired = true
          observer.disconnect()
          if (alreadyDone('watchedQuarterAds', ad.creativeId)) return
          try {
            const ip = await GetUserIpAddress()
            await axios.put(
              `${ROOT}/updatedImpressions`,
              {
                type: 'Large Quarter Page Banner',
                advertisementId: ad.advertisementId,
                creativeId: ad.creativeId,
                ip,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            )
            markDone('watchedQuarterAds', ad.creativeId)
          } catch {
            /* ignore tracking errors */
          }
        })
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ad, token])

  const handleClick = async () => {
    if (!ad || !token || alreadyDone('clickedQuarterAds', ad.creativeId)) return
    try {
      const ip = await GetUserIpAddress()
      await axios.put(
        `${ROOT}/updatedClicks`,
        {
          type: 'Large Quarter Page Banner',
          advertisementId: ad.advertisementId,
          creativeId: ad.creativeId,
          ip,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      markDone('clickedQuarterAds', ad.creativeId)
    } catch {
      /* ignore tracking errors */
    }
  }

  if (!ad || !ad.img) return null

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-[1080px] mx-auto my-6 px-4 ${className}`}
    >
      <a
        href={ad.adLink || '#'}
        target='_blank'
        rel='noopener noreferrer'
        onClick={(e) => {
          if (!ad.adLink) {
            e.preventDefault()
          } else {
            handleClick()
          }
        }}
      >
        <img
          src={ad.img}
          alt='Advertisement'
          className='w-full h-auto rounded-[8px] object-cover'
          style={{ aspectRatio: `${AD_WIDTH} / ${AD_HEIGHT}` }}
        />
      </a>
    </div>
  )
}

export default QuarterPageBanner
