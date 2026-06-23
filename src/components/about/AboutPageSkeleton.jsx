import { Shimmer, ShimmerLine } from '@/components/contact/Shimmer'

function SectionBars() {
  return (
    <div className='my-5 flex flex-row gap-2'>
      <Shimmer className='h-[5.6px] w-8 rounded-2xl' variant='gold' />
      <Shimmer className='h-[5.6px] w-20 rounded-lg' variant='gold' />
    </div>
  )
}

function SectionTitleSkeleton({ centered = false, width = 'w-48' }) {
  return (
    <div className={centered ? 'mx-auto flex max-w-2xl flex-col items-center' : ''}>
      <Shimmer className={`h-8 rounded md:h-10 ${centered ? 'w-56' : width}`} />
      <SectionBars />
    </div>
  )
}

function TwoColumnBlockSkeleton({ imageRight = false, imageRound = false }) {
  const image = (
    <Shimmer
      className={`h-52 w-full rounded-lg sm:h-64 md:h-[300px] ${imageRound ? 'rounded-full max-w-sm mx-auto' : ''}`}
    />
  )
  const text = (
    <div className='space-y-4'>
      <SectionTitleSkeleton width='w-56' />
      <ShimmerLine className='w-full' />
      <ShimmerLine className='w-full' />
      <ShimmerLine className='w-5/6' />
      <ShimmerLine className='w-4/6' />
    </div>
  )

  return (
    <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-2'>
      {imageRight ? (
        <>
          {text}
          {image}
        </>
      ) : (
        <>
          {image}
          {text}
        </>
      )}
    </div>
  )
}

function FeatureCardSkeleton({ tall = false }) {
  return (
    <div className='rounded-lg border border-reefGold/20 p-2 shadow-[0_2px_12px_rgba(162,145,62,0.06)]'>
      <Shimmer className={`w-full rounded-lg ${tall ? 'h-48' : 'h-40'}`} />
      <Shimmer className='mt-4 h-6 w-32 rounded' variant='gold' />
      <div className='mt-4 space-y-2'>
        <ShimmerLine className='w-full' />
        <ShimmerLine className='w-full' />
        <ShimmerLine className='w-4/5' />
      </div>
    </div>
  )
}

function UseCaseCardSkeleton() {
  return (
    <div className='rounded-lg bg-white p-4 text-center shadow-md border border-reefGold/15'>
      <Shimmer className='mx-auto h-40 w-full max-w-[300px] rounded' />
      <Shimmer className='mx-auto mt-4 h-6 w-28 rounded' variant='gold' />
      <div className='mt-3 space-y-2'>
        <ShimmerLine className='w-full' />
        <ShimmerLine className='w-full' />
        <ShimmerLine className='mx-auto w-5/6' />
      </div>
    </div>
  )
}

function AdditionalFeatureSkeleton() {
  return (
    <div className='rounded-lg border border-reefGold/20 bg-white p-6 text-center shadow-sm'>
      <Shimmer className='mx-auto mb-4 h-10 w-10 rounded' variant='gold' />
      <Shimmer className='mx-auto mb-3 h-5 w-4/5 rounded' />
      <div className='space-y-2'>
        <ShimmerLine className='w-full' />
        <ShimmerLine className='w-full' />
        <ShimmerLine className='mx-auto w-[92%]' />
      </div>
    </div>
  )
}

function InTouchSkeleton() {
  return (
    <div className='inTouchBg w-full px-5 py-10 md:px-20 md:py-14'>
      <div className='mx-auto flex max-w-xl flex-col items-center gap-5'>
        <Shimmer className='h-8 w-72 max-w-full rounded md:h-10' />
        <Shimmer className='h-10 w-40 rounded' variant='gold' />
      </div>
    </div>
  )
}

export default function AboutPageSkeleton() {
  return (
    <div aria-busy='true' aria-label='Loading about page'>
      {/* Hero */}
      <div className='valuesBg flex w-full flex-col py-16 md:px-20 md:py-24'>
        <div className='container mx-auto px-4'>
          <Shimmer className='h-10 w-48 rounded opacity-90 md:h-16 md:w-64' />
          <div className='mt-6 space-y-3 max-w-3xl'>
            <ShimmerLine className='w-full opacity-80' />
            <ShimmerLine className='w-full opacity-80' />
            <ShimmerLine className='w-5/6 opacity-80' />
          </div>
        </div>
      </div>

      <div className='bg-white'>
        {/* Our Mission */}
        <section className='mx-auto max-w-6xl px-4 py-12 md:py-16'>
          <TwoColumnBlockSkeleton />
        </section>

        {/* Our Features */}
        <section className='mx-auto max-w-6xl px-4 py-12 md:py-16'>
          <SectionTitleSkeleton centered />
          <div className='mt-8 grid gap-8 md:grid-cols-3'>
            <FeatureCardSkeleton tall />
            <FeatureCardSkeleton tall />
            <FeatureCardSkeleton tall />
          </div>
        </section>

        {/* User Verification */}
        <section className='mx-auto max-w-6xl px-4 py-12 md:py-16'>
          <TwoColumnBlockSkeleton />
        </section>

        {/* Use Cases */}
        <section className='mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 text-center sm:grid-cols-2 md:grid-cols-4 md:py-16'>
          <UseCaseCardSkeleton />
          <UseCaseCardSkeleton />
          <UseCaseCardSkeleton />
          <UseCaseCardSkeleton />
        </section>

        {/* Additional Features */}
        <section className='mx-auto max-w-6xl px-4 py-12 md:py-16'>
          <div className='mx-auto flex max-w-2xl flex-col items-center'>
            <SectionTitleSkeleton centered />
            <ShimmerLine className='mt-2 w-full max-w-xl' />
            <ShimmerLine className='w-4/5 max-w-md' />
          </div>
          <div className='mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3'>
            {Array.from({ length: 5 }).map((_, i) => (
              <AdditionalFeatureSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className='mx-auto max-w-6xl px-4 py-12 md:py-16'>
          <TwoColumnBlockSkeleton imageRound />
        </section>

        <InTouchSkeleton />
      </div>
    </div>
  )
}
