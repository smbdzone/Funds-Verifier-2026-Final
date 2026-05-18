import { Suspense } from "react"
import VerifyEmailPage from "../../../components/home/VerifyEmailPage"

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage />
    </Suspense>
  )
}
export default Page