import Image from 'next/image'

/**
 * QR scan block for listing detail pages. Shows the uploaded QR image
 * (click opens it full-size) or a "Not uploaded yet" placeholder.
 */
const ListingQrCodeSection = ({ src, className = '' }) => (
  <div className={`mb-3 ${className}`}>
    <p className='font-medium md:text-lg text-base mb-1'>QR Code</p>
    {src ? (
      <a
        href={src}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-block'
        title='Open QR code'
      >
        <Image
          src={src}
          alt='QR code'
          width={96}
          height={96}
          unoptimized
          className='h-24 w-24 rounded border border-gray-200 bg-white object-contain'
        />
      </a>
    ) : (
      <p className='text-sm text-black/50'>Not uploaded yet</p>
    )}
  </div>
)

export default ListingQrCodeSection
