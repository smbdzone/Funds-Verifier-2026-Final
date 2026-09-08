'use client'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  getTokenFromCookie,
  getFromLocalStorage,
  saveToLocalStorage,
} from '../../utils/helper'
import { GetUserIpAddress } from '@/utils/localization/GetUserLocalization'
import { useProfile } from '../../context/UserContext'

const ROOT = `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement`

const todayKey = () => new Date().toISOString().slice(0, 10)

/**
 * Footer Banner shown to LOGGED-IN visitors on listing pages. The backend
 * (getAllFooterBanners) serves one approved, paid, in-flight, in-budget footer
 * ad that isn't the viewer's own. Impressions (on scroll-into-view) and clicks
 * bill the advertiser; a per-creative/day localStorage guard avoids re-billing
 * the same creative while browsing. Renders nothing when logged out or when
 * there's no eligible ad.
 */
function FooterAdd() {
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

  // Fetch one eligible footer ad (logged-in only).
  useEffect(() => {
    if (!token) {
      setAd(null)
      return
    }
    let active = true
    const load = async () => {
      try {
        const res = await axios.get(`${ROOT}/getAllFooterBanners`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const doc = res?.data?.data?.[0]
        const creative = doc?.creatives?.[0]
        if (!active) return
        if (doc && creative) {
          setAd({
            advertisementId: doc._id,
            creativeId: creative._id, // backend arrayFilters match on _id
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

  // Fire an impression when the banner scrolls into view.
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
          if (alreadyDone('watchedFooterAds', ad.creativeId)) return
          try {
            const ip = await GetUserIpAddress()
            await axios.put(
              `${ROOT}/updatedImpressions`,
              {
                type: 'Footer Banner',
                advertisementId: ad.advertisementId,
                creativeId: ad.creativeId,
                ip,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            )
            markDone('watchedFooterAds', ad.creativeId)
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
    if (!ad || !token || alreadyDone('clickedFooterAds', ad.creativeId)) return
    try {
      const ip = await GetUserIpAddress()
      await axios.put(
        `${ROOT}/updatedClicks`,
        {
          type: 'Footer Banner',
          advertisementId: ad.advertisementId,
          creativeId: ad.creativeId,
          ip,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      markDone('clickedFooterAds', ad.creativeId)
    } catch {
      /* ignore tracking errors */
    }
  }

  if (!token || !ad || !ad.img) return null

  return (
    <div ref={containerRef} className="ads">
      <div className="img-div">
        <a
          href={ad.adLink || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!ad.adLink) {
              e.preventDefault()
            } else {
              handleClick()
            }
          }}
        >
          <img src={ad.img} alt="Footer Ad" style={{ marginBottom: '15px' }} />
        </a>
      </div>
    </div>
  )
}

export default FooterAdd
