import { Suspense } from 'react'
import RequestedReports from '../../../../components/modules/surveyDashboard/RequestedReports'

export default function page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <RequestedReports />
    </Suspense>
  )
}
