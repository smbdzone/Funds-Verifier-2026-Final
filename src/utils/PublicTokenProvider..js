'use client'
import { createContext, useContext } from 'react'
import { usePublicToken } from './usePublicToken'

const Ctx = createContext('')

export function PublicTokenProvider({ children }) {
  const token = usePublicToken()
 
  return <Ctx.Provider value={token}>{children}</Ctx.Provider>
}

export const usePublicTokenContext = () => useContext(Ctx)
