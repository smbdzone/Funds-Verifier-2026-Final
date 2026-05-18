'use client'
// import dynamic from 'next/dynamic'
import React from 'react'
import { PropertyEvaluationTab } from '@/components/modules/EvaluatorProfile/PropertyEvaluationTab'

const Page = () => {
  return (
    <div>
      <PropertyEvaluationTab />
    </div>
  )
}

export default Page
// export default dynamic(() => Promise.resolve(Page), { ssr: false })
