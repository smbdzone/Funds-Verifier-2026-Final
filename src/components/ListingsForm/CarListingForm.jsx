import { useEffect, useState } from 'react'
import ListingsImageComponent from '../ListingsImageComponent/ListingsImageComponent'
import ListingFormInput from '@/components/ListingFormInput/ListingFormInput'
import PhoneInputComponent from '@/components/ListingFormInput/PhoneInputComponent'
import ListingImageUploadLayout from '@/components/ListingsImageComponent/ListingImageUploadLayout'
import ListingMultipleImageComponent from '@/components/ListingsImageComponent/ListingMultipleImageComponent'
import ListingsVideoComponent from '@/components/ListingsImageComponent/ListingsVideoComponent'
import ListingTextareaComponent from '@/components/ListingsImageComponent/ListingTextareaComponent'
import ListingsDropdownInputComponents from '@/components/ListingsImageComponent/ListingsDropdownInputComponents'
import ListingModalInputComponent from '@/components/ListingsImageComponent/ListingModalInputComponent'
import ListingCustomPlacholderInput from '@/components/ListingFormInput/ListingCustomPlacholderInput'
import ListingCustomPlaceholderDropdown from '@/components/ListingsImageComponent/ListingCustomPlaceholderDropdown'
import TechnicalReport from '../Modals/TechnicalReport'
import Modal2 from '@/components/3dModal/Modal'
import EvaluationModal from '@/components/Evaluation/evaluationmodal.jsx'
import {
  LISTING_IMAGE_FORMATS_LABEL,
  LISTING_QR_SCAN_FORMATS_LABEL,
  LISTING_THUMBNAIL_FORMATS_LABEL,
  LISTING_VIDEO_FORMATS_LABEL,
} from '@/constants/listingUploadLimits'
import {
  warrantyOptions,
  bodyConditionOptions,
  doorOptions,
  cylindersOptions,
  engineCapacityOptions,
  horsepowerOptions,
  seatingCapacityOptions,
  steeringSideOptions,
  bodyTypeOptions,
  transmissionTypeOptions,
  carTypes,
} from '@/constants/car-listings'
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

const CarListingForm = ({
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
  fuelTypeOptions,
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
  type,
  dropdown3D,
}) => {
  const groupedData = carTypes.map((item) => ({
    text: item,
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
      console.error('Error loading technical report provider:', error)
      toast.error('Could not load technical report availability')
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
      console.error('Error loading 3D walkthrough provider:', error)
      toast.error('Could not load 3D walkthrough availability')
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
    <div>
      <ConfirmationModal />
      <ListingApprovedEditNotice formData={formData} />
      <form className='pt-[50px]'>
        <div className='grid gap-6 md:grid-cols-2 xxs:grid-cols-1'>
          <div className='relative flex flex-col justify-start'>
            <ListingFormInput
              errors={errors.title && !formData.title}
              value={formData.title}
              handleChange={handleChange}
              handleBlur={handleBlur}
              required={true}
              placeholder='Title your Car (max. 30 characters)'
              errorsMessage={errors.title}
              name='title'
              maxLength={30}
              type='text'
              disabled={isEvaluatorApprovedLocked}
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
              inputId='car-thumbnail'
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
              inputId='car-additional-pictures'
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
              disabled={isEvaluatorApprovedLocked}
            />
          </ListingImageUploadLayout>
          <ListingImageUploadLayout
            formats={LISTING_QR_SCAN_FORMATS_LABEL}
            label='Upload QR Scan (optional)'
          >
            <ListingsImageComponent
              image={qrScan}
              handleThumbImageChange={handleQrScanChange}
              handleImageRemove={handleQrScanRemove}
              disabled={isEvaluatorApprovedLocked}
              inputId='qr-scan-car'
              uploadLabel='Upload QR Scan'
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
          <div className='relative w-full dropdown-container space-y-6'>
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
            <div className='relative w-full dropdown-container'>
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
          </div>
          <div className='relative w-full dropdown-container'>
            <div className='relative flex flex-col justify-start'>
              <ListingFormInput
                errors={errors.size && !formData.size}
                value={formData.size}
                handleChange={handleChange}
                required={true}
                placeholder='Size'
                errorsMessage={errors.size}
                name='size'
                maxLength={50}
                type='text'
                disabled={isEvaluatorApprovedLocked}
              />
            </div>
            <div className='relative flex mt-[20px] flex-col justify-start'>
              <ListingFormInput
                errors={errors.kilometers && !formData.kilometers}
                value={formData.kilometers}
                handleChange={handleChange}
                handleBlur={handleBlur}
                required={true}
                placeholder='Kilometers'
                errorsMessage={errors.kilometers}
                name='kilometers'
                maxLength={50}
                type='text'
                disabled={isEvaluatorApprovedLocked}
              />
            </div>
            <div className='relative-placeholder mt-[20px] w-full'>
              <ListingModalInputComponent
                disabled={
                  !canRequestPremium || !formData?.uuid || blocksTechnicalReport
                }
                maxLength={50}
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
                type={'Car For Sale'}
                dropdown={groupedData}
                title='Cars'
                productTitle={formData?.title}
                productId={formData?.uuid}
                userUUID={data?.uuid}
              />
            </div>
          </div>
          <div className='relative w-full dropdown-container space-y-5'>
            <ListingsDropdownInputComponents
              errors={errors.fuelType && !formData.fuelType}
              errorMessage={errors.fuelType}
              value={formData.fuelType}
              placeholder='Fuel Type'
              name='fuelType'
              handleToggleDropdown={() => handleToggleDropdown('fuelType')}
              dropdown={dropdowns.fuelType}
              dropdownType='fuelType'
              dropdownOptions={fuelTypeOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('fuelType', option)
              }
              readOnly={true}
              disabled={isEvaluatorApprovedLocked}
            />
            <div className='relative-placeholder w-full'>
              <ListingModalInputComponent
                maxLength={50}
                disabled={
                  !canRequestPremium || !formData?.uuid || blocks3DWalkthrough
                }
                name='video3DWalkthrough'
                value={
                  premiumServiceFieldLabel(formData.video3DWalkthrough) ||
                  modalData.dateTime
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
                type={type}
                productId={formData?.uuid}
                productTitle={formData?.title}
                dropdown={groupedData}
                title='Cars'
                userUUID={data2?.uuid}
              />
            </div>
            <div className='relative-placeholder dropdown-container flex flex-col w-full'>
              <ListingModalInputComponent
                maxLength={50}
                name='evaluationDateTime'
                value={formData.evaluationDateTime}
                handleChange={handleChange}
                disabled={isEvaluatorApprovedLocked}
                required={true}
                errors={
                  errors.evaluationDateTime && !formData.evaluationDateTime
                }
                errorMessage={errors.evaluationDateTime}
                handleOpenModal={handleOpenModal1}
                customPlaceholder='Request Evaluation'
              />

              <EvaluationModal
                isOpen={isModal1Open}
                onClose={handleClose1Modal}
                formData={formData}
                setFormData={setFormData}
                assetType='Car For Sale'
                dropdown={groupedData}
                title='Car Type'
              />
            </div>
          </div>

          <div className='relative w-full dropdown-container'>
            <div className='relative flex flex-col justify-start'>
              <ListingFormInput
                errors={errors.year && !formData.year}
                value={formData.year}
                handleChange={handleChange}
                handleBlur={handleBlur}
                required={true}
                placeholder='Year'
                errorsMessage={errors.year}
                name='year'
                type='text'
                disabled={isEvaluatorApprovedLocked}
              />
            </div>
          </div>
          <div className='relative w-full dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.warranty && !formData.warranty}
              errorMessage={errors.warranty}
              value={formData.warranty}
              placeholder='Warranty'
              name='warranty'
              handleToggleDropdown={() => handleToggleDropdown('warranty')}
              dropdown={dropdowns.warranty}
              disabled={isEvaluatorApprovedLocked}
              dropdownType='warranty'
              dropdownOptions={warrantyOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('warranty', option)
              }
              readOnly={true}
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.bodyCondition && !formData.bodyCondition}
              errorMessage={errors.bodyCondition}
              value={formData.bodyCondition}
              disabled={isEvaluatorApprovedLocked}
              placeholder='Body Condition'
              name='bodyCondition'
              handleToggleDropdown={() => handleToggleDropdown('bodyCondition')}
              dropdown={dropdowns.bodyCondition}
              dropdownType='bodyCondition'
              dropdownOptions={bodyConditionOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('bodyCondition', option)
              }
              readOnly={true}
            />
          </div>
          <div className='relative-placeholder w-full'>
            <ListingsDropdownInputComponents
              errors={errors.carType && !formData.carType}
              errorMessage={errors.carType}
              value={formData.carType}
              disabled={isEvaluatorApprovedLocked}
              placeholder='car Type'
              name='carType'
              handleToggleDropdown={() => handleToggleDropdown('carType')}
              dropdown={dropdowns.carType}
              dropdownType='carType'
              dropdownOptions={carTypes}
              handleSelectOption={(_, option) =>
                handleSelectOption('carType', option)
              }
              readOnly={true}
            />
          </div>
          <div className='relative-placeholder w-full'>
            <ListingsDropdownInputComponents
              errors={errors.noofCylinders && !formData.noofCylinders}
              errorMessage={errors.noofCylinders}
              value={formData.noofCylinders}
              disabled={isEvaluatorApprovedLocked}
              placeholder='No. of Cylinders'
              name='noofCylinders'
              handleToggleDropdown={() => handleToggleDropdown('noofCylinders')}
              dropdown={dropdowns.noofCylinders}
              dropdownType='noofCylinders'
              dropdownOptions={cylindersOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('noofCylinders', option)
              }
              readOnly={true}
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <div className='relative-placeholder w-full'>
              <ListingCustomPlacholderInput
                value={formData.capacityWeight}
                handleChange={handleChange}
                disabled={isEvaluatorApprovedLocked}
                name='capacityWeight'
                customPlaceholder='Capacity/Weight'
              />
            </div>
          </div>
          <div className='relative w-full dropdown-container'>
            <div className='relative-placeholder w-full'>
              <ListingCustomPlacholderInput
                value={formData.mechanicalCondition}
                handleChange={handleChange}
                disabled={isEvaluatorApprovedLocked}
                name='mechanicalCondition'
                customPlaceholder='Mechanical condition'
              />
            </div>
          </div>
          <div className='relative w-full dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.seats && !formData.seats}
              errorMessage={errors.seats}
              value={formData.seats}
              placeholder='Seats'
              name='seats'
              handleToggleDropdown={() => handleToggleDropdown('seats')}
              dropdown={dropdowns.seats}
              disabled={isEvaluatorApprovedLocked}
              dropdownType='seats'
              dropdownOptions={seatingCapacityOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('seats', option)
              }
              readOnly={true}
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.bodyType && !formData.bodyType}
              errorMessage={errors.bodyType}
              value={formData.bodyType}
              disabled={isEvaluatorApprovedLocked}
              placeholder='Body Type'
              name='bodyType'
              handleToggleDropdown={() => handleToggleDropdown('bodyType')}
              dropdown={dropdowns.bodyType}
              dropdownType='bodyType'
              dropdownOptions={bodyTypeOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('bodyType', option)
              }
              readOnly={true}
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.doors && !formData.doors}
              errorMessage={errors.doors}
              value={formData.doors}
              disabled={isEvaluatorApprovedLocked}
              placeholder='Doors'
              name='doors'
              handleToggleDropdown={() => handleToggleDropdown('doors')}
              dropdown={dropdowns.doors}
              dropdownType='doors'
              dropdownOptions={doorOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('doors', option)
              }
              readOnly={true}
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <ListingCustomPlaceholderDropdown
              value={formData.horsepower}
              name='horsepower'
              handleToggleDropdown={() => handleToggleDropdown('horsepower')}
              dropdown={dropdowns.horsepower}
              dropdownType='horsepower'
              dropdownOptions={horsepowerOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('horsepower', option)
              }
              readOnly={true}
              customPlaceholder='Horsepower '
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.steeringSide && !formData.steeringSide}
              errorMessage={errors.steeringSide}
              value={formData.steeringSide}
              placeholder='Steering Side'
              disabled={isEvaluatorApprovedLocked}
              name='steeringSide'
              handleToggleDropdown={() => handleToggleDropdown('steeringSide')}
              dropdown={dropdowns.steeringSide}
              dropdownType='steeringSide'
              dropdownOptions={steeringSideOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('steeringSide', option)
              }
              readOnly={true}
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.transmissionType && !formData.transmissionType}
              errorMessage={errors.transmissionType}
              value={formData.transmissionType}
              disabled={isEvaluatorApprovedLocked}
              placeholder='Transmission Type'
              name='transmissionType'
              handleToggleDropdown={() =>
                handleToggleDropdown('transmissionType')
              }
              dropdown={dropdowns.transmissionType}
              dropdownType='transmissionType'
              dropdownOptions={transmissionTypeOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('transmissionType', option)
              }
              readOnly={true}
            />
          </div>
          <div className='relative flex flex-col justify-start'>
            <ListingFormInput
              errors={errors.VIN}
              value={formData.VIN}
              handleChange={handleChange}
              handleBlur={handleBlur}
              disabled={isEvaluatorApprovedLocked}
              required={true}
              placeholder='VIN'
              errorsMessage={errors.VIN}
              name='VIN'
              type='text'
              maxLength={50}
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <ListingCustomPlaceholderDropdown
              value={formData.engineCapacity}
              name='engineCapacity'
              handleToggleDropdown={() =>
                handleToggleDropdown('engineCapacity')
              }
              dropdown={dropdowns.engineCapacity}
              dropdownType='engineCapacity'
              disabled={isEvaluatorApprovedLocked}
              dropdownOptions={engineCapacityOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('engineCapacity', option)
              }
              readOnly={true}
              customPlaceholder='Engine Capacity '
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default CarListingForm
