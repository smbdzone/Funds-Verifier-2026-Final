import { useEffect, useState } from 'react'
import ListingFormInput from '@/components/ListingFormInput/ListingFormInput'
import PhoneInputComponent from '@/components/ListingFormInput/PhoneInputComponent'
import ListingImageUploadLayout from '@/components/ListingsImageComponent/ListingImageUploadLayout'
import ListingsImageComponent from '@/components/ListingsImageComponent/ListingsImageComponent'
import ListingMultipleImageComponent from '@/components/ListingsImageComponent/ListingMultipleImageComponent'
import ListingsVideoComponent from '@/components/ListingsImageComponent/ListingsVideoComponent'
import ListingTextareaComponent from '@/components/ListingsImageComponent/ListingTextareaComponent'
import ListingsDropdownInputComponents from '@/components/ListingsImageComponent/ListingsDropdownInputComponents'
import ListingModalInputComponent from '@/components/ListingsImageComponent/ListingModalInputComponent'
import ListingCustomPlacholderInput from '@/components/ListingFormInput/ListingCustomPlacholderInput'
import Modal2 from '@/components/3dModal/Modal'
import TechnicalReport from '@/components/Modals/TechnicalReport'
import {
  conditionOptions,
  age,
  usage,
  warrenty,
  length,
} from '@/constants/boat-listings'
import { boatForSale } from '../../constants/sidebar'
import EvaluationModal from '@/components/Evaluation/evaluationmodal.jsx'
import {
  LISTING_IMAGE_FORMATS_LABEL,
  LISTING_QR_SCAN_FORMATS_LABEL,
  LISTING_THUMBNAIL_FORMATS_LABEL,
  LISTING_VIDEO_FORMATS_LABEL,
} from '@/constants/listingUploadLimits'
import customAxios from '../../utils/apis/apis'
import { toast } from 'react-toastify'
import { XIcon } from 'lucide-react'
import {
  canRequestPremiumServices,
  isListingEvaluatorApprovedLocked,
  isListingPriceLocked,
} from '@/libs/listingEditLock'
import ListingApprovedEditNotice from '@/components/ListingsForm/ListingApprovedEditNotice'
import {
  blocksPremiumServiceRequest,
  premiumServiceFieldLabel,
} from '@/libs/listingPremiumStatus'

const BoatListingForm = ({
  formData,
  handleChange,
  handleBlur,
  errors,
  flags,
  phoneNumber,
  thumbnail,
  handlePhoneNumberChange,
  handleCountryChange,
  selectedCountryPhone,
  maxLength,
  handleThumbImageChange,
  handleThumbImageRemove,
  qrScan,
  handleQrScanChange,
  handleQrScanRemove,
  images,
  videos,
  handleImageRemove,
  handleImageChange,
  handleVideoRemove,
  handleVideoChange,
  fileInputRef,
  totalprice,
  handleTechnicalModal,
  technicalModalData,
  isTechnicalModalOpen,
  handleCloseTechnicalModal,
  handleRequestTechnicalModalData,
  handleToggleDropdown,
  handleSelectOption,
  modalData,
  handleOpenModal1,
  handleOpenModal,
  handleCloseModal,
  handleRequestModalData,
  isModal1Open,
  handleClose1Modal,
  isModalOpen,
  setFormData,
  dropdowns,
}) => {
  const groupedData = boatForSale.map(({ brand }) => ({
    text: brand,
  }))

  const [data, setData] = useState()
  const [data2, setData2] = useState()

  const getIdByRole = async () => {
    try {
      const response = await customAxios.get(
        `/user/service-providers/TechnicalReport`
      )

      const providers = Array.isArray(response?.data) ? response.data : []
      if (providers.length > 0) {
        setData(providers[0])
      }
    } catch (error) {
      console.warn('Technical report provider unavailable:', error?.message)
    }
  }
  useEffect(() => {
    getIdByRole()
    getIdByRole3d()
  }, [])

  const getIdByRole3d = async () => {
    try {
      const response = await customAxios.get(
        `/user/service-providers/3dWalkthrough`
      )

      const providers = Array.isArray(response?.data) ? response.data : []
      if (providers.length > 0) {
        setData2(providers[0])
      }
    } catch (error) {
      console.warn('3D walkthrough provider unavailable:', error?.message)
    }
  }

  const [modalOpen, setModalOpen] = useState(false)
  const [RequestService, setRequestService] = useState('')
  const isEvaluatorApprovedLocked = isListingEvaluatorApprovedLocked(formData)
  const isPriceLocked = isListingPriceLocked(formData)
  const canRequestPremium = canRequestPremiumServices(formData)
  const blocksTechnicalReport = blocksPremiumServiceRequest(formData?.technicalReport)
  const blocks3DWalkthrough = blocksPremiumServiceRequest(formData?.video3DWalkthrough)

  const openPremiumGate = () => {
    setModalOpen(true)
    setRequestService('Evaluator Approval')
  }

  const ConfirmationModal = () => {
    if (!modalOpen) return null
    return (
      <>
        <div className='fixed inset-0 modal-bg  z-10'></div>
        <div className='fixed inset-0 flex justify-center  items-center z-20  '>
          <div className='bg-white rounded-tl-3xl rounded-bl-3xl rounded-br-3xl rounded-tr-sm  w-[391px] z-30  px-5 '>
            <div className='py-4 flex justify-end items-center  mb-3'>
              <span
                className='cursor-pointer pr-5 mb'
                onClick={() => {
                  setModalOpen(false)
                }}
              >
                <XIcon />
              </span>
            </div>
            <h2 className='text-black/50 text-center text-light-gold text-[25px] font-medium mb-4   font-montserrat '>
              Request {RequestService || ''}
            </h2>
            <p className='text-black mb-4 text-center w-full'>
              {RequestService === 'Evaluator Approval'
                ? 'You can request a 3D walkthrough or technical report only after your listing has been evaluated and approved.'
                : `You can request ${RequestService || 'this service'} after saving your listing.`}
            </p>
            <div className='flex justify-center mb-10  '>
              <button
                onClick={() => setModalOpen(false)}
                type='button'
                className='border-2 border-light-gold text-[15px]  rounded-sm  px-8   py-3'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <ConfirmationModal />
      <ListingApprovedEditNotice formData={formData} />
      <form className='pt-[50px]'>
        <div className='md:grid gap-6 md:space-y-0 space-y-5 md:grid-cols-2'>
          <div className='relative flex flex-col justify-start'>
            <ListingFormInput
              errors={errors.title && !formData.title}
              value={formData.title}
              handleChange={handleChange}
              disabled={isEvaluatorApprovedLocked}
              handleBlur={handleBlur}
              required={true}
              placeholder='Title your Boat (max. 60 characters)'
              errorsMessage={errors.title}
              name='title'
              maxLength={60}
              type='text'
            />
          </div>

          <div className='relative w-full'>
            <PhoneInputComponent
              flags={flags}
              errors={errors.phoneNumber && !formData.phoneNumber}
              value={phoneNumber}
              handlePhoneNumberChange={handlePhoneNumberChange}
              handleCountryChange={handleCountryChange}
              selectedCountryPhone={selectedCountryPhone}
              maxLength={maxLength}
              errorMessage={errors.phoneNumber}
              disabled={isEvaluatorApprovedLocked}
            />
          </div>
          <ListingImageUploadLayout
            errors={errors.thumbnail && !thumbnail}
            formats={LISTING_THUMBNAIL_FORMATS_LABEL}
            label='Thumbnail'
            required
          >
            <ListingsImageComponent
              errors={errors.thumbnail && !thumbnail}
              image={thumbnail}
              errorMessage={errors.thumbnail}
              handleThumbImageChange={handleThumbImageChange}
              handleImageRemove={handleThumbImageRemove}
              disabled={isEvaluatorApprovedLocked}
              inputId='boat-thumbnail'
            />
          </ListingImageUploadLayout>
          <ListingImageUploadLayout
            errors={errors.pictures && images.length === 0}
            formats={LISTING_IMAGE_FORMATS_LABEL}
            label='Additional pictures'
            required
          >
            <ListingMultipleImageComponent
              images={images}
              handleImageRemove={handleImageRemove}
              handleImageChange={handleImageChange}
              errors={errors.pictures && images.length === 0}
              errorMessage={errors.pictures}
              disabled={isEvaluatorApprovedLocked}
              inputId='boat-additional-pictures'
            />
          </ListingImageUploadLayout>
          <ListingImageUploadLayout
            formats={LISTING_VIDEO_FORMATS_LABEL}
            label='Video (optional)'
          >
            <ListingsVideoComponent
              videos={videos}
              handleVideoRemove={handleVideoRemove}
              fileInputRef={fileInputRef}
              handleVideoChange={handleVideoChange}
              disabled={isEvaluatorApprovedLocked || Boolean(formData?.video?.uuid)}
            />
          </ListingImageUploadLayout>
          <ListingImageUploadLayout
            formats={LISTING_QR_SCAN_FORMATS_LABEL}
            label='Upload QR Scan'
            required
            errors={errors.qrScan && !qrScan}
          >
            <ListingsImageComponent
              image={qrScan}
              handleThumbImageChange={handleQrScanChange}
              handleImageRemove={handleQrScanRemove}
              disabled={isEvaluatorApprovedLocked}
              inputId='qr-scan-boat'
              uploadLabel='Upload QR Scan'
              errors={errors.qrScan && !qrScan}
              errorMessage={errors.qrScan}
            />
          </ListingImageUploadLayout>
          <div className='relative w-full dropdown-container'>
            <div className='relative-placeholder w-full'>
              <ListingCustomPlacholderInput
                value={formData.dldNumber || ''}
                handleChange={handleChange}
                name='dldNumber'
                customPlaceholder='DLD Number'
                disabled={isEvaluatorApprovedLocked}
              />
            </div>
          </div>
          <div className='relative dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.condition && !formData.condition}
              errorMessage={errors.condition}
              value={formData.condition}
              placeholder='Condition'
              name='condition'
              handleToggleDropdown={() => handleToggleDropdown('condition')}
              dropdown={dropdowns.condition}
              dropdownType='condition'
              dropdownOptions={conditionOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('condition', option)
              }
              disabled={isEvaluatorApprovedLocked}
              readOnly={true}
            />
            <div className='relative dropdown-container mt-5'>
              <ListingFormInput
                errors={
                  (errors.price && parseInt(totalprice) === 0) ||
                  (!totalprice && errors.price)
                }
                value={totalprice}
                handleChange={handleChange}
                onBlur={handleBlur}
                required={true}
                placeholder='Price'
                errorsMessage={errors.price}
                name='price'
                type='text'
                disabled={isPriceLocked}
              />
            </div>
            <div className='mt-5 relative-placeholder w-full'>
              <ListingModalInputComponent
                maxLength={50}
                disabled={
                  !canRequestPremium || !formData?.uuid || blocksTechnicalReport
                }
                name='technicalReport'
                value={
                  premiumServiceFieldLabel(formData.technicalReport) ||
                  technicalModalData.dateTime
                }
                handleChange={handleChange}
                errors={errors.technicalReport && !formData.technicalReport}
                errorMessage={errors.technicalReport}
                handleOpenModal={
                  !canRequestPremium
                    ? openPremiumGate
                    : formData?.uuid
                      ? handleTechnicalModal
                      : () => {
                        setModalOpen(true)
                        setRequestService('Technical Report')
                      }
                }
                dateTime={technicalModalData.dateTime !== ''}
                customPlaceholder='Request Technical Report'
                icon='/icons/card2.png'
              />
              <TechnicalReport
                isOpen={isTechnicalModalOpen}
                onClose={handleCloseTechnicalModal}
                onSave={handleRequestTechnicalModalData}
                type={'Boats For Sale'}
                dropdown={groupedData}
                title='Boats'
                userUUID={data?.uuid}
                productTitle={formData?.title}
                productId={formData?.uuid}
                listingPhone={formData?.phoneNumber || phoneNumber || ''}
              />
            </div>
          </div>
          <div className='relative-placeholder w-full'>
            <ListingModalInputComponent
              maxLength={50}
              name='evaluationDateTime'
              value={formData.evaluationDateTime}
              handleChange={handleChange}
              disabled={isEvaluatorApprovedLocked}
              required={true}
              errors={errors.evaluationDateTime && !formData.evaluationDateTime}
              errorMessage={errors.evaluationDateTime}
              handleOpenModal={handleOpenModal1}
              customPlaceholder='Request Evaluation'
            />
            <EvaluationModal
              isOpen={isModal1Open}
              onClose={handleClose1Modal}
              formData={formData}
              setFormData={setFormData}
              assetType='Boats For Sale'
              dropdown={groupedData}
              title='Boat Brand'
            />
          </div>
          <div className='relative-placeholder w-full'>
            <ListingModalInputComponent
              maxLength={50}
              name='video3DWalkthrough'
              value={
                premiumServiceFieldLabel(formData.video3DWalkthrough) ||
                modalData.dateTime
              }
              disabled={
                !canRequestPremium || !formData?.uuid || blocks3DWalkthrough
              }
              handleChange={handleChange}
              errors={errors.video3DWalkthrough}
              errorMessage={errors.video3DWalkthrough}
              dateTime={modalData.dateTime !== ''}
              handleOpenModal={
                !canRequestPremium
                  ? openPremiumGate
                  : formData?.uuid
                    ? handleOpenModal
                    : () => {
                      setModalOpen(true)
                      setRequestService('3D Walkthrough')
                    }
              }
              customPlaceholder='3D Walkthrough Embedded Link'
              icon='/icons/3dicon.png'
            />
            <request3d onClick={handleOpenModal} />
            <Modal2
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={handleRequestModalData}
              setFormData={setFormData}
              type={'Boats For Sale'}
              dropdown={groupedData}
              title='Boats'
              productId={formData?.uuid}
              productTitle={formData?.title}
              userUUID={data2?.uuid}
              listingPhone={formData?.phoneNumber || phoneNumber || ''}
            />
          </div>
          <div className='w-full col-span-2'>
            <ListingTextareaComponent
              errors={
                errors.description ||
                (String(formData.description).length > 300 &&
                  !formData.description)
              }
              value={formData.description}
              name='description'
              handleChange={handleChange}
              handleBlur={handleBlur}
              placeholder='Tell us about your Property (max. 300 characters)'
              errorsMessage={errors.description}
              maxLength={300}
              disabled={isEvaluatorApprovedLocked}
            />
          </div>
          <div className='relative dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.length && !formData.length}
              errorMessage={errors.length}
              value={formData.length}
              placeholder='Length'
              name='length'
              handleToggleDropdown={() => handleToggleDropdown('length')}
              dropdown={dropdowns.length}
              dropdownType='length'
              dropdownOptions={length}
              disabled={isEvaluatorApprovedLocked}
              handleSelectOption={(_, option) =>
                handleSelectOption('length', option)
              }
              readOnly={true}
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <div className='relative-placeholder w-full'>
              <ListingCustomPlacholderInput
                errors={errors.brands}
                value={formData.brands}
                handleChange={handleChange}
                disabled={isEvaluatorApprovedLocked}
                name='brands'
                customPlaceholder='Brands'
                maxLength={50}
              />
            </div>
          </div>
          <div className='relative w-full dropdown-container'>
            <div className='relative-placeholder w-full'>
              <ListingCustomPlacholderInput
                errors={errors.locateBoat}
                value={formData.locateBoat}
                handleChange={handleChange}
                name='locateBoat'
                customPlaceholder='Locate Your Boat'
                maxLength={50}
              />
            </div>
          </div>

          <div className='relative dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.usage && !formData.usage}
              errorMessage={errors.usage}
              value={formData.usage}
              placeholder='Usage'
              disabled={isEvaluatorApprovedLocked}
              name='usage'
              handleToggleDropdown={() => handleToggleDropdown('usage')}
              dropdown={dropdowns.usage}
              dropdownType='usage'
              dropdownOptions={usage}
              handleSelectOption={(_, option) =>
                handleSelectOption('usage', option)
              }
              readOnly={true}
            />
          </div>
          {/* 15  age*/}
          <div className='relative dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.age && !formData.age}
              errorMessage={errors.age}
              value={formData.age}
              placeholder='Age'
              name='age'
              disabled={isEvaluatorApprovedLocked}
              handleToggleDropdown={() => handleToggleDropdown('age')}
              dropdown={dropdowns.age}
              dropdownType='age'
              dropdownOptions={age}
              handleSelectOption={(_, option) =>
                handleSelectOption('age', option)
              }
              readOnly={true}
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <div className='relative-placeholder w-full'>
              <ListingCustomPlacholderInput
                errors={errors.sportsOutdoorPrice}
                value={formData.sportsOutdoorPrice}
                handleChange={handleChange}
                disabled={isEvaluatorApprovedLocked}
                name='sportsOutdoorPrice'
                customPlaceholder='Sports & Outdoor Price'
                maxLength={50}
              />
            </div>
          </div>
          <div className='relative w-full dropdown-container'>
            <ListingFormInput
              errors={errors.seats && !formData.seats}
              value={formData.seats}
              handleChange={handleChange}
              required={true}
              placeholder='Seats'
              dropdown={dropdowns.seats}
              disabled={isEvaluatorApprovedLocked}
              errorsMessage={errors.seats}
              name='seats'
              type='text'
            />
          </div>

          <div className='relative dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.warrenty && !formData.warrenty}
              errorMessage={errors.warrenty}
              value={formData?.warrenty}
              placeholder='Warrenty'
              name='warrenty'
              handleToggleDropdown={() => handleToggleDropdown('warrenty')}
              dropdown={dropdowns.warrenty}
              dropdownType='warrenty'
              dropdownOptions={warrenty}
              handleSelectOption={(_, option) =>
                handleSelectOption('warrenty', option)
              }
              readOnly={true}
            />
          </div>
        </div>
      </form>
    </>
  )
}

export default BoatListingForm
