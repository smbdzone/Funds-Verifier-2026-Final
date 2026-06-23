import { useEffect, useState } from 'react'
import TechnicalReport from '@/components/Modals/TechnicalReport'
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
import {
  age,
  conditionOptions,
  usage,
  warrenty,
} from '@/constants/listing-data'
import EvaluationModal from '@/components/Evaluation/evaluationmodal.jsx'
import {
  LISTING_IMAGE_FORMATS_LABEL,
  LISTING_VIDEO_FORMATS_LABEL,
} from '@/constants/listingUploadLimits'
import { jewelryForSale } from '../../constants/sidebar'
import customAxios from '../../utils/apis/apis'
import { toast } from 'react-toastify'
import { XIcon } from 'lucide-react'
import {
  canRequestPremiumServices,
  isListingEvaluatorApprovedLocked,
} from '@/libs/listingEditLock'
import ListingApprovedEditNotice from '@/components/ListingsForm/ListingApprovedEditNotice'
import {
  blocksPremiumServiceRequest,
  premiumServiceFieldLabel,
} from '@/libs/listingPremiumStatus'

const JewelryListingForm = ({
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
  const groupedData = jewelryForSale.map(({ brand }) => ({
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
      console.error('Error loading technical report provider:', error)
      toast.error('Could not load technical report availability')
    }
  }

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

  useEffect(() => {
    getIdByRole()
    getIdByRole3d()
  }, [])

  const [modalOpen, setModalOpen] = useState(false)
  const [RequestService, setRequestService] = useState('')
  const isEvaluatorApprovedLocked = isListingEvaluatorApprovedLocked(formData)
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
              handleBlur={handleBlur}
              disabled={isEvaluatorApprovedLocked}
              required={true}
              placeholder='Title your Jewellery (max. 30 characters)'
              errorsMessage={errors.title}
              name='title'
              maxLength={30}
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
            errors={errors.pictures && images.length === 0}
            formats={LISTING_IMAGE_FORMATS_LABEL}
          >
            <ListingMultipleImageComponent
              images={images}
              handleImageRemove={handleImageRemove}
              handleImageChange={handleImageChange}
              errors={errors.pictures && images.length === 0}
              errorMessage={errors.pictures}
              disabled={isEvaluatorApprovedLocked}
            />
          </ListingImageUploadLayout>
          <ListingImageUploadLayout
            errors={errors.thumbnail && !thumbnail}
            formats={LISTING_IMAGE_FORMATS_LABEL}
          >
            <ListingsImageComponent
              errors={errors.thumbnail && !thumbnail}
              image={thumbnail}
              errorMessage={errors.thumbnail}
              handleThumbImageChange={handleThumbImageChange}
              handleImageRemove={handleThumbImageRemove}
              disabled={isEvaluatorApprovedLocked}
            />
          </ListingImageUploadLayout>
          <ListingImageUploadLayout formats={LISTING_VIDEO_FORMATS_LABEL}>
            <ListingsVideoComponent
              videos={videos}
              handleVideoRemove={handleVideoRemove}
              fileInputRef={fileInputRef}
              handleVideoChange={handleVideoChange}
              disabled={isEvaluatorApprovedLocked}
            />
          </ListingImageUploadLayout>
          <div className='relative dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.condition && !formData.condition}
              errorMessage={errors.condition}
              value={formData.condition}
              disabled={isEvaluatorApprovedLocked}
              placeholder='Condition'
              name='condition'
              handleToggleDropdown={() => handleToggleDropdown('condition')}
              dropdown={dropdowns.condition}
              dropdownType='condition'
              dropdownOptions={conditionOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('condition', option)
              }
              readOnly={true}
            />
            <div className='mt-7 relative  dropdown-container'>
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
              />
            </div>
            <div className='relative-placeholder mt-6 w-full'>
              <ListingModalInputComponent
                maxLength={50}
                name='evaluationDateTime'
                value={formData.evaluationDateTime}
                handleChange={handleChange}
                required={true}
                errors={
                  errors.evaluationDateTime && !formData.evaluationDateTime
                }
                errorMessage={errors.evaluationDateTime}
                handleOpenModal={handleOpenModal1}
                customPlaceholder='Request Evaluation'
                disabled={isEvaluatorApprovedLocked}
              />
              <EvaluationModal
                isOpen={isModal1Open}
                onClose={handleClose1Modal}
                formData={formData}
                setFormData={setFormData}
              />
            </div>
          </div>
          <div className='relative-placeholder w-full'>
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
              required={true}
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
              subPlaceholder=' (Optional)'
              icon='/icons/card2.png'
            />
            <TechnicalReport
              isOpen={isTechnicalModalOpen}
              onClose={handleCloseTechnicalModal}
              onSave={handleRequestTechnicalModalData}
              type={'Jewellery For Sale'}
              dropdown={groupedData}
              title='Jewellery'
              productTitle={formData?.title}
              productId={formData?.uuid}
              userUUID={data?.uuid}
            />
          </div>
          <div className='relative-placeholder w-full'>
            <ListingModalInputComponent
              maxLength={50}
              name='video3DWalkthrough'
              value={
                premiumServiceFieldLabel(formData.video3DWalkthrough) ||
                modalData?.dateTime
              }
              disabled={
                !canRequestPremium || !formData?.uuid || blocks3DWalkthrough
              }
              handleChange={handleChange}
              required={true}
              errors={errors.video3DWalkthrough}
              errorMessage={errors.video3DWalkthrough}
              dateTime={modalData?.dateTime !== ''}
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
              subPlaceholder=' (Optional)'
              icon='/icons/3dicon.png'
            />
            <Modal2
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={handleRequestModalData}
              setFormData={setFormData}
              type='Jewellery For Sale'
              dropdown={groupedData}
              title='Jewellery'
              productId={formData?.uuid}
              productTitle={formData?.title}
              userUUID={data2?.uuid}
            />
          </div>
          <div className='w-full col-span-2 flex flex-col gap-5'>
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
          <div className='relative flex flex-col gap-4 w-full dropdown-container'>
            <div className='relative-placeholder w-full'>
              <ListingCustomPlacholderInput
                errors={errors.locateJewelry}
                value={formData.locateJewelry}
                handleChange={handleChange}
                disabled={isEvaluatorApprovedLocked}
                name='locateJewelry'
                customPlaceholder='Locate Your Jewelry'
                subPlaceholder=' (Optional)'
                maxLength={50}
                required={true}
              />
            </div>
            <div className='relative dropdown-container'>
              <ListingsDropdownInputComponents
                errors={errors.warrenty && !formData.warrenty}
                errorMessage={errors.warrenty}
                value={formData.warrenty}
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
          <div className='relative flex flex-col gap-4 w-full dropdown-container'>
            <div className='relative-placeholder w-full'>
              <ListingCustomPlacholderInput
                errors={errors.lengthh}
                value={formData.lengthh}
                handleChange={handleChange}
                name='lengthh'
                customPlaceholder='Length'
                subPlaceholder=' (Optional)'
                maxLength={50}
                required={true}
              />
            </div>
            <div className='relative dropdown-container'>
              <ListingFormInput
                errors={errors.grams && !formData.grams}
                value={formData.grams}
                handleChange={handleChange}
                required={true}
                disabled={isEvaluatorApprovedLocked}
                placeholder='Grams'
                errorsMessage={errors.grams}
                name='grams'
                type='text'
              />
            </div>
          </div>
          <div className='relative dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.usage && !formData.usage}
              errorMessage={errors.usage}
              value={formData.usage}
              disabled={isEvaluatorApprovedLocked}
              placeholder='Usage'
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
          <div className='relative dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.age && !formData.age}
              errorMessage={errors.age}
              disabled={isEvaluatorApprovedLocked}
              value={formData.age}
              placeholder='Age'
              name='age'
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
                errors={errors.jewelryStyles}
                value={formData.jewelryStyles}
                handleChange={handleChange}
                disabled={isEvaluatorApprovedLocked}
                name='jewelryStyles'
                customPlaceholder='Jewelry Styles'
                subPlaceholder=' (Optional)'
                maxLength={50}
                required={true}
              />
            </div>
          </div>
          <div className='relative w-full dropdown-container'>
            <div className='relative-placeholder w-full'>
              <ListingCustomPlacholderInput
                errors={errors.jewelryMetal}
                value={formData.jewelryMetal}
                handleChange={handleChange}
                disabled={isEvaluatorApprovedLocked}
                name='jewelryMetal'
                customPlaceholder='Jewelry'
                subPlaceholder=' (Optional)'
                required={true}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default JewelryListingForm
