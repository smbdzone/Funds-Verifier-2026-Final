import React, { useEffect, useState } from 'react'
import flags from 'react-phone-number-input/flags'
import Modal2 from '@/components/3dModal/Modal'
import TechnicalReport from '../Modals/TechnicalReport'
import { formatDateTime } from '@/utils/global-functions/global'
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
import ListingCustomPlaceholderDropdown from '@/components/ListingsImageComponent/ListingCustomPlaceholderDropdown'
import customAxios from '../../utils/apis/apis'
import { toast } from 'react-toastify'
import EvaluationModal from '@/components/Evaluation/evaluationmodal.jsx'
import {
  LISTING_IMAGE_FORMATS_LABEL,
  LISTING_VIDEO_FORMATS_LABEL,
} from '@/constants/listingUploadLimits'
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
export const ImageUploadComponent = React.memo(
  ({
    formData,
    handleChange,
    handleBlur,
    errors,
    phoneNumber,
    thumbnail,
    bedroomsOptions,
    handleOpenModal,
    handleThumbImageRemove,
    handleThumbImageChange,
    handlePhoneNumberChange,
    handleCountryChange,
    selectedCountryPhone,
    maxLength,
    handleImageChange,
    images,
    handleImageRemove,
    videos,
    handleVideoChange,
    handleVideoRemove,
    totalprice,
    fileInputRef,
    isModalOpen,
    handleCloseModal,
    handleRequestModalData,
    handleToggleDropdown,
    id,
    handleSelectOption,
    handleOpenModal1,
    isModal1Open,
    setFormData,
    handleClose1Modal,
    technicalModalData,
    handleTechnicalModal,
    isTechnicalModalOpen,
    handleCloseTechnicalModal,
    handleRequestTechnicalModalData,
    occupancyStatusOptions,
    modalData,
    totalSize,
    dropdowns,
    bathroomsOptions,
    setModalData,
    leaseNumberofChequesOptions,
    isFurnishedOptions,
    type,
    dropdown3D,
  }) => {
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
      <form className='pt-[50px]'>
        <ConfirmationModal />
        <ListingApprovedEditNotice formData={formData} />
        <div className='md:grid gap-6 md:space-y-0 space-y-5 md:grid-cols-2'>
          <div className='relative w-full '>
            <ListingFormInput
              errors={errors.title && !formData.title}
              value={formData.title || ''}
              disabled={isEvaluatorApprovedLocked}
              handleChange={handleChange}
              handleBlur={handleBlur}
              required={true}
              placeholder='Title your property (max. 30 characters)'
              errorsMessage={errors.title}
              name='title'
              maxLength={30}
              type='text'
            />
          </div>
          <div className='relative w-full '>
            <PhoneInputComponent
              flags={flags}
              errors={errors.phoneNumber && !formData.phoneNumber}
              value={phoneNumber || ''}
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
          <ListingImageUploadLayout formats={LISTING_VIDEO_FORMATS_LABEL}>
            <ListingsVideoComponent
              videos={videos}
              handleVideoRemove={handleVideoRemove}
              fileInputRef={fileInputRef}
              handleVideoChange={handleVideoChange}
              disabled={isEvaluatorApprovedLocked}
            />
          </ListingImageUploadLayout>
          <div className='relative w-full dropdown-container space-y-6'>
            <ListingTextareaComponent
              errors={
                errors.description ||
                (String(formData.description).length > 300 &&
                  !formData.description)
              }
              value={formData.description || ''}
              name='description'
              handleChange={handleChange}
              handleBlur={handleBlur}
              placeholder='Tell us about your Property (max. 300 characters)'
              errorsMessage={errors.description}
              maxLength={300} // Pass max length to the child
              disabled={isEvaluatorApprovedLocked}
            />
            <div className='relative w-full dropdown-container'>
              <ListingFormInput
                errors={
                  (errors.price && parseInt(totalprice) === 0) ||
                  (!totalprice && errors.price)
                }
                value={totalprice || ''}
                handleChange={handleChange}
                onBlur={handleBlur}
                required={true}
                placeholder='Price'
                errorsMessage={errors.price}
                name='price'
                type='text'
              />
            </div>
          </div>
          <div className='col-span-2'>
            <div className='w-full  '>
              <ListingTextareaComponent
                errors={
                  errors.additionalDescription &&
                  String(formData.additionalDescription).length > 1000
                }
                value={formData.additionalDescription || ''}
                name='additionalDescription'
                handleChange={handleChange}
                handleBlur={handleBlur}
                placeholder='Additional Description'
                errorsMessage={errors.additionalDescription}
                maxLength={1000}
                disabled={isEvaluatorApprovedLocked}
              />
            </div>
          </div>
          <div className='relative-placeholder w-full'>
            <ListingModalInputComponent
              maxLength={50}
              disabled={
                !canRequestPremium || !formData?.uuid || blocks3DWalkthrough
              }
              name='video3DWalkthrough'
              value={
                premiumServiceFieldLabel(formData?.video3DWalkthrough) ||
                modalData?.dateTime ||
                ''
              }
              handleChange={handleChange}
              required={true}
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
              subPlaceholder=' (Optional)'
              icon='/icons/3dicon.png'
            />
            <Modal2
              isOpen={isModalOpen}
              type={type}
              onClose={handleCloseModal}
              onSave={handleRequestModalData}
              productId={formData?.uuid}
              productTitle={formData?.title}
              setModalData={setModalData}
              dropdown3D={dropdown3D}
              bedroomsDropDown={bedroomsOptions}
              title='Bedrooms'
              userUUID={data2?.uuid}
            />
          </div>
          <div className='relative flex flex-col justify-start space-y-5'>
            <ListingFormInput
              errors={
                (errors.sizeSQFT && totalSize === 'Size in') ||
                (!totalSize && errors.sizeSQFT)
              }
              value={
                id ? `${formData.sizeSQFT || ''} SQFT` : `${totalSize} SQFT`
              }
              disabled={isEvaluatorApprovedLocked}
              handleChange={handleChange}
              onBlur={handleBlur}
              required={true}
              placeholder='Size in SQFT'
              errorsMessage={errors.sizeSQFT}
              maxLength={50}
              name='sizeSQFT'
              type='text'
            />
          </div>
          {formData.assetType === 'Property For Lease' && (
            <div className='relative w-full dropdown-container'>
              <ListingsDropdownInputComponents
                errors={
                  errors.leaseNumberofCheques && !formData.leaseNumberofCheques
                }
                errorMessage={errors.leaseNumberofCheques}
                value={formData.leaseNumberofCheques || ''}
                placeholder='Lease no of Cheques'
                name='leaseNumberofCheques'
                handleToggleDropdown={() =>
                  handleToggleDropdown('leaseNumberofCheques')
                }
                dropdown={dropdowns.leaseNumberofCheques}
                dropdownType='leaseNumberofCheques'
                dropdownOptions={leaseNumberofChequesOptions}
                handleSelectOption={(_, option) =>
                  handleSelectOption('leaseNumberofCheques', option)
                }
                disabled={isEvaluatorApprovedLocked}
                readOnly={isEvaluatorApprovedLocked}
              />
            </div>
          )}
          <div className='relative-placeholder w-full'>
            <ListingModalInputComponent
              maxLength={50}
              name='evaluationDateTime'
              disabled={isEvaluatorApprovedLocked}
              value={
                formData.evaluationDateTime
                  ? formatDateTime(formData.evaluationDateTime).formattedDate
                  : ''
              }
              handleChange={handleChange}
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
            />
          </div>
          <div className='relative-placeholder w-full'>
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
              type={'Property For Sale'}
              dropdown3D={dropdown3D}
              bedroomsDropDown={bedroomsOptions}
              title='Bedrooms'
              productTitle={formData?.title}
              productId={formData?.uuid}
              userUUID={data?.uuid}
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.bedrooms && !formData.bedrooms}
              errorMessage={errors.bedrooms}
              value={formData.bedrooms || ''}
              placeholder='Bedrooms'
              name='bedrooms'
              handleToggleDropdown={() => handleToggleDropdown('bedrooms')}
              dropdown={dropdowns.bedrooms}
              dropdownType='bedrooms'
              dropdownOptions={bedroomsOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('bedrooms', option)
              }
              readOnly={isEvaluatorApprovedLocked}
              disabled={isEvaluatorApprovedLocked}
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <ListingsDropdownInputComponents
              errors={errors.bathrooms && !formData.bathrooms}
              errorMessage={errors.bathrooms}
              value={formData.bathrooms || ''}
              placeholder='Bathrooms'
              name='bathrooms'
              handleToggleDropdown={() => handleToggleDropdown('bathrooms')}
              dropdown={dropdowns.bathrooms}
              dropdownType='bathrooms'
              dropdownOptions={bathroomsOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('bathrooms', option)
              }
              readOnly={isEvaluatorApprovedLocked}
              disabled={isEvaluatorApprovedLocked}
            />
          </div>
          <div className='relative-placeholder w-full'>
            <ListingsDropdownInputComponents
              errors={errors.occupancyStatus && !formData.occupancyStatus}
              errorMessage={errors.occupancyStatus}
              value={formData.occupancyStatus || ''}
              placeholder='Occupancy Status'
              name='occupancyStatus'
              handleToggleDropdown={() =>
                handleToggleDropdown('occupancyStatus')
              }
              dropdown={dropdowns.occupancyStatus}
              disabled={isEvaluatorApprovedLocked}
              dropdownType='occupancyStatus'
              dropdownOptions={occupancyStatusOptions}
              handleSelectOption={(_, option) =>
                handleSelectOption('occupancyStatus', option)
              }
              readOnly={isEvaluatorApprovedLocked}
            />
          </div>
          <div className='relative w-full dropdown-container'>
            <div className='relative-placeholder w-full'>
              <ListingCustomPlacholderInput
                value={formData.developer || ''}
                handleChange={handleChange}
                name='developer'
                customPlaceholder='Developer'
                subPlaceholder=' (Optional)'
                disabled={isEvaluatorApprovedLocked}
              />
            </div>
          </div>
          <div className='relative w-full dropdown-container'>
            <div className='relative-placeholder w-full'>
              <ListingCustomPlaceholderDropdown
                value={formData.isFurnished || ''}
                name='isFurnished'
                handleToggleDropdown={() => handleToggleDropdown('isFurnished')}
                dropdown={dropdowns.isFurnished}
                dropdownType='isFurnished'
                dropdownOptions={isFurnishedOptions}
                handleSelectOption={(_, option) =>
                  handleSelectOption('isFurnished', option)
                }
                disabled={isEvaluatorApprovedLocked}
                readOnly={isEvaluatorApprovedLocked}
                customPlaceholder='Is it furnished? '
                subPlaceholder='(Optional)'
              />
            </div>
          </div>
        </div>
      </form>
    )
  }
)
ImageUploadComponent.displayName = 'ImageUploadComponent'
