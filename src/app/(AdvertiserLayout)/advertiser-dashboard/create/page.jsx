'use client'
import { useRouter } from 'next/navigation'
import CreateAdvertisementForm from '@/components/advertisementComponent/CreateAdvertisementForm'

const CreatePage = () => {
  const router = useRouter()

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold text-[#002D4F]'>
          Create Advertisement
        </h1>
        <p className='text-gray-500 mt-1'>
          Upload your creative, set targeting and budget, then pay to submit for
          approval.
        </p>
      </div>

      <div className='rounded-xl bg-white border border-gray-100 shadow-sm p-4 sm:p-8'>
        <CreateAdvertisementForm
          onCreated={() => router.push('/advertiser-dashboard/my-ads')}
        />
      </div>
    </div>
  )
}

export default CreatePage
