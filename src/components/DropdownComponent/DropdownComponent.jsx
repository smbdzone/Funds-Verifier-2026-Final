'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { usePathname } from 'next/navigation'
import { toUnitedArabEmiratesListingCountryName } from '@/libs/dummyLocationData'
import {
  clearListingWorkspaceStorage,
  getListingRouteForAssetType,
} from '@/libs/pendingListingDraft'
import { ListingContext } from '@/components/ListingContext/ListingsProvider'

const DropdownComponent = ({
  isListings,
  handleToggleDropdown,
  formData,
  handleMouseLeave,
  label,
  handleSelectOption,
  dropdowns,
  dropdownOptions,
  searchQuery,
  setSearchQuery,
  upperLabel,
  setLand,
  placeholder,
  error,
  errorMessage,
  disabled, // ✅ added disabled prop
  required = false,
}) => {
  const pathname = usePathname()
  const listingCtx = useContext(ListingContext) || {}

  const switchToAssetType = (optionValue) => {
    const currentRoute = getListingRouteForAssetType(
      listingCtx.formData?.assetType || formData,
    )
    const nextRoute = getListingRouteForAssetType(optionValue)
    // Leaving property → boat (etc.): wipe media, form, and payment drafts.
    if (currentRoute && nextRoute && currentRoute !== nextRoute) {
      clearListingWorkspaceStorage()
      listingCtx.resetForm?.()
    } else if (
      listingCtx.formData?.assetType &&
      listingCtx.formData.assetType !== optionValue
    ) {
      // Same route but different asset (e.g. For Sale → Off Plan): clear fields.
      clearListingWorkspaceStorage()
      listingCtx.resetForm?.()
    }
    handleSelectOption?.('assetType', optionValue)
  }

  const renderLabelContent = () => (
    <button
      type='button'
      className={`dropdownButton h-full pl-2 pr-3 py-2 md:py-0 border-b md:border-b-none border-dark-grey md:border-r w-full text-start text-light-blue ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
        }`}
      onClick={!disabled ? handleToggleDropdown : undefined}
      disabled={disabled}
      aria-expanded={Boolean(dropdowns)}
    >
      <span className='sr-only'>{upperLabel}</span>
      <div className='flex justify-between'>
        <div>
          <p className='xl:text-lg lg:text-base md:text-[12px] xxs:text-sm font-medium text-dark-black text-start'>
            {label}
            {required ? (
              <span className='ml-0.5 text-reefGold font-semibold' aria-hidden='true'>
                *
              </span>
            ) : null}
          </p>
          <p className='lg:text-xs md:text-[10px] truncate xxs:text-xs font-normal pt-[5px] text-dark-grey'>
            {label === 'Asset Type'
              ? dropdownOptions?.find((o) => o.value === formData)?.label ||
                formData ||
                ''
              : formData || ''}
          </p>
        </div>
        <Image
          width={12}
          height={12}
          src='/listing/arrowgold.svg'
          alt='arrowblue'
          className={`xl:ml-[30px] lg:ml-[20px] xxs:ml-[10px] transition-transform duration-200 ${dropdowns ? 'rotate-180' : ''
            } ${disabled ? 'opacity-40' : ''}`}
        />
      </div>
    </button>
  )

  // ✅ Asset Type dropdown
  const renderAssetTypeDropdown = () => (
    <div className='absolute mt-2 left-0 right-0 bg-white rounded-lg shadow-neon z-30 py-2'>
      {dropdownOptions?.map((option, index) => {
        const targetPath = `/dashboard/${option.link}-listing`
        const href = `${targetPath}?assetType=${encodeURIComponent(option.value)}`
        const isSameListingPage = pathname === targetPath
        const optionClassName = `px-2 py-2 text-start ${option.disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:text-[#8D7C3B] hover:bg-[#F5F5F5] text-gray-400 cursor-pointer'
          }`

        if (isSameListingPage) {
          return (
            <div
              key={index}
              role='button'
              tabIndex={option.disabled ? -1 : 0}
              className={optionClassName}
              onClick={
                !option.disabled
                  ? () => switchToAssetType(option.value)
                  : undefined
              }
            >
              {option.label || option.value}
            </div>
          )
        }

        return (
          <Link key={index} href={href}>
            <div
              className={optionClassName}
              onClick={
                !option.disabled
                  ? () => switchToAssetType(option.value)
                  : undefined
              }
            >
              {option.label || option.value}
            </div>
          </Link>
        )
      })}
    </div>
  )

  // ✅ Property Type dropdown
  const renderPropertyTypeDropdown = () => (
    <div className='absolute mt-2 left-0 right-0 bg-white rounded-lg shadow-neon z-30 py-2'>
      {dropdownOptions?.map((type, index) => (
        <div key={index} className='relative'>
          <div
            role='button'
            tabIndex={0}
            onClick={type.onclick}
            className='relative flex justify-between items-center cursor-pointer p-2 hover:bg-gray-100 hover:text-[#8D7C3B] hover:bg-[#F5F5F5] text-gray-400'
          >
            {type.text}
            <Image
              width={10}
              height={10}
              src='/listing/arrowgold.svg'
              alt='arrowblue'
              className={`transition-transform duration-200 ${type.state ? 'rotate-0' : '-rotate-90'
                }`}
            />
          </div>
          {type.state && type.mapData ? (
            <div className='absolute text-xs left-full top-0 ml-1 !w-[135px] bg-white justify-center items-center flex flex-col rounded-lg shadow-neon z-40'>
              {type.mapData.map((ele) => (
                <p
                  key={ele.id}
                  onClick={() => handleSelectOption(ele.value)}
                  className='cursor-pointer w-full text-center p-2 hover:bg-gray-100 hover:text-[#8D7C3B] hover:bg-[#F5F5F5] text-gray-400'
                >
                  {ele.value}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )

  // ✅ General dropdown (country, city, etc.)
  const renderGeneralDropdown = () => (
    <div className='absolute mt-2 left-0 right-0 max-h-[280px] bg-white h-96 overflow-y-auto rounded-lg shadow-neon z-30 py-2'>
      {!['Make', 'Model', 'Category', 'Subcategory'].includes(label) && (
        <input
          type='text'
          placeholder={placeholder}
          className='w-full p-2 bg-[#F5F5F5] outline-none text-[#8D7C3B]'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      {dropdownOptions?.map((option, index) => (
        <div
          key={index}
          onClick={() =>
            handleSelectOption(
              [
                'All Countries',
                'Category',
                'Subcategory',
                'Model',
                'Make',
              ].includes(label)
                ? option
                : ['City', 'Neighbourhood'].includes(label)
                  ? option
                  : '',
              option
            )
          }
          className='cursor-pointer p-2 truncate hover:bg-gray-100 px-2 py-2 hover:text-[#8D7C3B] hover:bg-[#F5F5F5] text-gray-400'
        >
          {label === 'All Countries'
            ? toUnitedArabEmiratesListingCountryName(option.country) ||
            option.country
            : ['City', 'Neighbourhood'].includes(label)
              ? option
              : ['Category', 'Subcategory', 'Model'].includes(label)
                ? option
                : label === 'Make'
                  ? option.brand
                  : ''}
        </div>
      ))}
    </div>
  )

  return (
    <>
      {isListings && (
        <div
          className='relative w-full text-start dropdown-container'
          data-dropdown-root
        >
          {renderLabelContent()}

          {error && (
            <span className='text-red-500 lg:text-sm text-xs font-medium'>
              **{errorMessage}
            </span>
          )}

          {/* ✅ Disable dropdown completely when disabled */}
          {dropdowns && !disabled && (
            <>
              {label === 'Asset Type' && renderAssetTypeDropdown()}
              {label === 'Property Type' && renderPropertyTypeDropdown()}
              {!['Asset Type', 'Property Type'].includes(label) &&
                renderGeneralDropdown()}
            </>
          )}
        </div>
      )}
    </>
  )
}

export default DropdownComponent
