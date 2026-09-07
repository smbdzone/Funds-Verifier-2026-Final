'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** Price List is evaluator-only — sub-evaluators are redirected away. */
export default function SubEvaluatorPriceListRemovedPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/sub-evaluator-profile')
  }, [router])
  return null
}
