'use client'
import { createContext, useContext } from 'react'

const Ctx = createContext('')

/**
 * Kept for compatibility with pages that read usePublicTokenContext.
 * Token is fetched on demand via getPublicToken() / axios interceptors
 * (shared in-memory cache) — not eagerly on every layout mount.
 */
export function PublicTokenProvider({ children }) {
  return <Ctx.Provider value="">{children}</Ctx.Provider>
}

export const usePublicTokenContext = () => useContext(Ctx)
