import React, { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { PlusIcon, SearchIcon } from '@/components/Icons'
import { SlArrowRight } from 'react-icons/sl'
import Modal from '../../documents/modal'
import Loader from '../EvaluatorProfile/requestCompoenets/Loader'
import DocumentSection from '../EvaluatorProfile/requestCompoenets/DocumentSection'
import EvaluatorDateField from '../EvaluatorProfile/requestCompoenets/EvaluatorDateField'
import { useProfile } from '../../../context/UserContext'
import {
  fetchListingDocumentRequests,
  fetchTrusteeAllDocumentRequests,
  fetchTrusteeListings,
  formatDocumentAssetType,
  formatRequestDocumentDate,
  resolveRequestDocumentFile,
  saveListingDocumentRequests,
} from '@/utils/requestedDocumentUpload'
import {
  getRequestDocumentName,
  requestDocumentsMissingDate,
} from '@/utils/requestDocumentUtils'

const LISTING_DROPDOWN_VISIBLE_ROWS = 5
const LISTING_ROW_HEIGHT_PX = 40

const ASSET_TYPE_OPTIONS = [
  { value: 'Property', label: 'Property' },
  { value: 'OffPlan', label: 'Off Plan' },
  { value: 'Car', label: 'Car' },
  { value: 'Boats', label: 'Boats' },
  { value: 'Jewellery', label: 'Jewellery' },
]

export const TrusteeDocumentManagement = () => {
  const { user } = useProfile()
  const [listings, setListings] = useState([])
  const [selectedListingId, setSelectedListingId] = useState('')
  const [requestDocument, setRequestDocument] = useState([])
  const [documentHistory, setDocumentHistory] = useState([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [loadingRequests, setLoadingRequests] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newDocument, setNewDocument] = useState('')
  const [newDocumentDate, setNewDocumentDate] = useState('')
  const [showTextArea, setShowTextArea] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [editText, setEditText] = useState('')
  const [openingHistoryKey, setOpeningHistoryKey] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [pdfFileName, setPdfFileName] = useState('')
  const [listingMenuOpen, setListingMenuOpen] = useState(false)
  const [assetTypeMenuOpen, setAssetTypeMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAssetType, setSelectedAssetType] = useState('')
  const [searchMenuOpen, setSearchMenuOpen] = useState(false)
  const listingDropdownRef = useRef(null)
  const assetTypeDropdownRef = useRef(null)
  const searchDropdownRef = useRef(null)

  const selectedListing = useMemo(
    () => listings.find((listing) => listing.uuid === selectedListingId),
    [listings, selectedListingId],
  )

  const sortedListings = useMemo(
    () =>
      [...listings].sort((a, b) =>
        String(a.title || '').localeCompare(String(b.title || '')),
      ),
    [listings],
  )

  const listingMatchesName = (listing, term) => {
    const title = String(listing.title || '').toLowerCase()
    return title.includes(term)
  }

  const propertyNameSearchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return []

    return sortedListings.filter((listing) => listingMatchesName(listing, term))
  }, [sortedListings, searchTerm])

  const filteredListings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return sortedListings.filter((listing) => {
      if (selectedAssetType && listing.listingType !== selectedAssetType) {
        return false
      }
      if (!term) return true
      return listingMatchesName(listing, term)
    })
  }, [sortedListings, selectedAssetType, searchTerm])

  const handleSearchChange = (event) => {
    const value = event.target.value
    setSearchTerm(value)
    setSearchMenuOpen(value.trim().length > 0)

    if (!value.trim()) {
      setSelectedListingId('')
    }
  }

  const handleSelectFromSearch = (listing) => {
    setSelectedAssetType(listing.listingType || '')
    setSelectedListingId(listing.uuid)
    setSearchTerm(listing.title || '')
    setSearchMenuOpen(false)
    setListingMenuOpen(false)
    setAssetTypeMenuOpen(false)
  }

  const handleSelectAssetType = (assetType) => {
    setSelectedAssetType(assetType)
    setSelectedListingId('')
    setAssetTypeMenuOpen(false)
    setListingMenuOpen(false)
  }

  const handleSelectListing = (listing) => {
    setSelectedListingId(listing.uuid)
    setSearchTerm(listing.title || '')
    setListingMenuOpen(false)
    setSearchMenuOpen(false)
  }

  useEffect(() => {
    if (!listingMenuOpen && !assetTypeMenuOpen && !searchMenuOpen) return

    const handleClickOutside = (event) => {
      const clickedOutsideListing =
        listingDropdownRef.current &&
        !listingDropdownRef.current.contains(event.target)
      const clickedOutsideAssetType =
        assetTypeDropdownRef.current &&
        !assetTypeDropdownRef.current.contains(event.target)
      const clickedOutsideSearch =
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)

      if (listingMenuOpen && clickedOutsideListing) {
        setListingMenuOpen(false)
      }
      if (assetTypeMenuOpen && clickedOutsideAssetType) {
        setAssetTypeMenuOpen(false)
      }
      if (searchMenuOpen && clickedOutsideSearch) {
        setSearchMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [listingMenuOpen, assetTypeMenuOpen, searchMenuOpen])

  useEffect(() => {
    if (searchTerm.trim() && selectedAssetType) {
      setListingMenuOpen(true)
    }
  }, [searchTerm, selectedAssetType])

  useEffect(() => {
    if (
      selectedListingId &&
      !filteredListings.some((listing) => listing.uuid === selectedListingId)
    ) {
      setSelectedListingId('')
    }
  }, [filteredListings, selectedListingId])

  const loadListings = async () => {
    try {
      const data = await fetchTrusteeListings()
      setListings(data)
    } catch (error) {
      console.error(error)
      toast.error('Could not load listings')
      setListings([])
    }
  }

  const loadHistory = async () => {
    try {
      const history = await fetchTrusteeAllDocumentRequests()
      setDocumentHistory(history)
    } catch (error) {
      console.error(error)
      toast.error('Could not load document history')
      setDocumentHistory([])
    }
  }

  const loadInitialData = async () => {
    setLoadingListings(true)
    setLoadingHistory(true)
    try {
      await Promise.all([loadListings(), loadHistory()])
    } finally {
      setLoadingListings(false)
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (!selectedListing?.uuid || !selectedListing?.listingType) {
      setRequestDocument([])
      return
    }

    const loadRequests = async () => {
      setLoadingRequests(true)
      try {
        const docs = await fetchListingDocumentRequests(
          selectedListing.listingType,
          selectedListing.uuid,
        )
        setRequestDocument(docs)
      } catch (error) {
        console.error(error)
        toast.error('Could not load document requests for this listing')
        setRequestDocument([])
      } finally {
        setLoadingRequests(false)
      }
    }

    loadRequests()
  }, [selectedListing?.uuid, selectedListing?.listingType])

  const closeModal = () => {
    setIsModalOpen(false)
    setPdfUrl('')
    setPdfFileName('')
  }

  const handleOpenDoc = (url) => {
    if (!url) {
      toast.error('Unable to open this document.')
      return
    }
    setPdfUrl(url)
    setPdfFileName('document.pdf')
    setIsModalOpen(true)
  }

  const handleViewHistoryDocument = async (entry) => {
    if (entry.status !== 'Uploaded') return

    const historyKey = `${entry.listingId}-${entry.requestIndex}`
    setOpeningHistoryKey(historyKey)
    try {
      const file = await resolveRequestDocumentFile(entry)
      if (!file?.url) {
        toast.error('Unable to open this document.')
        return
      }
      setPdfUrl(file.url)
      setPdfFileName(file.fileName)
      setIsModalOpen(true)
    } catch (error) {
      console.error(error)
      toast.error('Unable to open this document.')
    } finally {
      setOpeningHistoryKey(null)
    }
  }

  const handleAddDocument = () => {
    if (!selectedListing) {
      toast.error('Select a listing first.')
      return
    }
    if (newDocument.trim() === '') {
      toast.error('Please enter a document name.')
      return
    }
    if (!newDocumentDate) {
      toast.error('Please select a date for the document request.')
      return
    }

    setRequestDocument([
      ...requestDocument,
      { name: newDocument.trim(), document: null, date: newDocumentDate },
    ])
    setNewDocument('')
    setNewDocumentDate('')
    setShowTextArea(false)
  }

  const handleEdit = (index) => {
    setEditIndex(index)
    setEditText(getRequestDocumentName(requestDocument[index]))
  }

  const handleSaveEdit = (index) => {
    const updatedDocuments = [...requestDocument]
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      name: editText.trim(),
    }
    setRequestDocument(updatedDocuments)
    setEditIndex(null)
    setEditText('')
  }

  const handleDelete = (index) => {
    setRequestDocument(requestDocument.filter((_, i) => i !== index))
  }

  const handleSubmitRequests = async () => {
    if (!selectedListing) {
      toast.error('Select a listing first.')
      return
    }
    if (!requestDocument.length) {
      toast.error('Add at least one document request.')
      return
    }
    if (requestDocumentsMissingDate(requestDocument)) {
      toast.error('Each requested document must have a date.')
      return
    }

    setSubmitting(true)
    try {
      const response = await saveListingDocumentRequests({
        listingType: selectedListing.listingType,
        listingId: selectedListing.uuid,
        requestDocument,
      })

      if (response?.status === 200) {
        toast.success('Document requests sent to asset holder.')
        await loadHistory()
      } else {
        toast.error('Could not save document requests.')
      }
    } catch (error) {
      console.error(error)
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        'Could not save document requests.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <span className='sm:text-base text-sm lg:text-lg text-prussianBlue/40 mb-4 block'>
        {user?.role || 'Trustee'}
      </span>

      <div className='custom-shadow w-full max-w-full min-w-0'>
        <h1 className='font-medium sm:text-lg text-base lg:text-xl md:px-10 px-5 py-5 custom-shadow rounded text-prussianBlue'>
          Document Management
        </h1>

        <div className='md:px-10 px-5 py-7'>
          <h2 className='font-medium sm:text-lg text-base lg:text-xl text-prussianBlue mb-2'>
            Request Documents
          </h2>

          <div className='mb-4' ref={searchDropdownRef}>
            <label className='mb-2 block text-sm font-medium text-prussianBlue'>
              Search Property by Name
            </label>
            <div className='relative'>
              <div className='flex items-center overflow-hidden rounded-md border border-prussianBlue'>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (searchTerm.trim()) setSearchMenuOpen(true)
                  }}
                  placeholder='Type property name...'
                  className='flex-1 px-3 py-2.5 text-sm text-prussianBlue outline-none'
                />
                <button
                  type='button'
                  className='bg-gray-100 px-3 py-2.5 text-prussianBlue'
                  aria-label='Search property by name'
                >
                  <SearchIcon />
                </button>
              </div>

              {searchMenuOpen && searchTerm.trim() ? (
                <div className='absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-prussianBlue bg-white shadow-lg'>
                  <div
                    className='overflow-y-auto'
                    style={{
                      maxHeight:
                        LISTING_ROW_HEIGHT_PX * LISTING_DROPDOWN_VISIBLE_ROWS,
                    }}
                  >
                    {propertyNameSearchResults.length > 0 ? (
                      propertyNameSearchResults.map((listing) => {
                        const isSelected = listing.uuid === selectedListingId
                        return (
                          <button
                            key={listing.uuid}
                            type='button'
                            onClick={() => handleSelectFromSearch(listing)}
                            className={`block w-full px-3 text-left text-sm hover:bg-gray-100 ${isSelected
                              ? 'bg-whiteSmoke font-medium text-prussianBlue'
                              : 'text-prussianBlue'
                              }`}
                            style={{ minHeight: LISTING_ROW_HEIGHT_PX }}
                            title={listing.title || 'Untitled'}
                          >
                            <span className='block truncate font-medium'>
                              {listing.title || 'Untitled'}
                            </span>
                            <span className='block truncate text-xs text-slate-500'>
                              {formatDocumentAssetType(listing.listingType)}
                            </span>
                          </button>
                        )
                      })
                    ) : (
                      <p className='px-3 py-3 text-sm text-gray-500'>
                        No properties found for &quot;{searchTerm.trim()}&quot;
                      </p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className='mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div ref={assetTypeDropdownRef}>
              <label className='mb-2 block text-sm font-medium text-prussianBlue'>
                Select Asset Type
              </label>
              <div className='relative'>
                <button
                  type='button'
                  disabled={loadingListings}
                  onClick={() => setAssetTypeMenuOpen((open) => !open)}
                  className='flex w-full items-center justify-between rounded-md border border-prussianBlue bg-white px-3 py-2.5 text-left text-sm text-prussianBlue outline-none disabled:cursor-not-allowed disabled:opacity-60'
                >
                  <span className='truncate pr-2'>
                    {loadingListings
                      ? 'Loading...'
                      : selectedAssetType || 'Choose asset type'}
                  </span>
                  <span
                    className={`shrink-0 rotate-90 transition-transform ${assetTypeMenuOpen ? '-rotate-90' : ''}`}
                  >
                    <SlArrowRight className='text-prussianBlue' />
                  </span>
                </button>

                {assetTypeMenuOpen ? (
                  <div className='absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-prussianBlue bg-white shadow-lg'>
                    {ASSET_TYPE_OPTIONS.map((option) => {
                      const isSelected = selectedAssetType === option.value
                      return (
                        <button
                          key={option.value}
                          type='button'
                          onClick={() => handleSelectAssetType(option.value)}
                          className={`block w-full truncate px-3 text-left text-sm hover:bg-gray-100 ${isSelected
                            ? 'bg-whiteSmoke font-medium text-prussianBlue'
                            : 'text-prussianBlue'
                            }`}
                          style={{ height: LISTING_ROW_HEIGHT_PX }}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            <div ref={listingDropdownRef}>
              <label className='mb-2 block text-sm font-medium text-prussianBlue'>
                Select Listing Name
              </label>
              <div className='relative'>
                <button
                  type='button'
                  disabled={
                    loadingListings ||
                    !selectedAssetType ||
                    filteredListings.length === 0
                  }
                  onClick={() => setListingMenuOpen((open) => !open)}
                  className='flex w-full items-center justify-between rounded-md border border-prussianBlue bg-white px-3 py-2.5 text-left text-sm text-prussianBlue outline-none disabled:cursor-not-allowed disabled:opacity-60'
                >
                  <span className='truncate pr-2'>
                    {loadingListings
                      ? 'Loading listings...'
                      : !selectedAssetType
                        ? 'Select asset type first'
                        : filteredListings.length === 0
                          ? 'No listings found'
                          : selectedListing
                            ? selectedListing.title || 'Untitled'
                            : 'Choose listing name'}
                  </span>
                  <span
                    className={`shrink-0 rotate-90 transition-transform ${listingMenuOpen ? '-rotate-90' : ''}`}
                  >
                    <SlArrowRight className='text-prussianBlue' />
                  </span>
                </button>

                {listingMenuOpen && selectedAssetType && filteredListings.length > 0 ? (
                  <div className='absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-prussianBlue bg-white shadow-lg'>
                    <div
                      className='overflow-y-auto'
                      style={{
                        maxHeight:
                          LISTING_ROW_HEIGHT_PX * LISTING_DROPDOWN_VISIBLE_ROWS,
                      }}
                    >
                      {filteredListings.map((listing) => {
                        const isSelected = listing.uuid === selectedListingId
                        return (
                          <button
                            key={listing.uuid}
                            type='button'
                            onClick={() => handleSelectListing(listing)}
                            className={`block w-full truncate px-3 text-left text-sm hover:bg-gray-100 ${isSelected
                              ? 'bg-whiteSmoke font-medium text-prussianBlue'
                              : 'text-prussianBlue'
                              }`}
                            style={{ height: LISTING_ROW_HEIGHT_PX }}
                            title={listing.title || 'Untitled'}
                          >
                            {listing.title || 'Untitled'}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {selectedListing ? (
            loadingRequests ? (
              <p className='text-sm text-gray-500'>Loading document requests...</p>
            ) : (
              <>
                <DocumentSection
                  title='Request documents'
                  documents={requestDocument}
                  handleOpenDoc={handleOpenDoc}
                  setEditText={setEditText}
                  handleEdit={handleEdit}
                  handleSaveEdit={handleSaveEdit}
                  handleDelete={handleDelete}
                  editIndex={editIndex}
                  editText={editText}
                  setEditIndex={setEditIndex}
                />

                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5'>
                  <div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
                    <button
                      type='button'
                      onClick={() => setShowTextArea(!showTextArea)}
                      className='border border-blue-500 px-3 py-2 text-sm rounded-md flex gap-2 items-center w-fit'
                    >
                      <div className='flex items-center justify-center rounded-full bg-prussianBlue'>
                        <PlusIcon />
                      </div>
                      <span className='text-prussianBlue'>Add Document</span>
                    </button>

                    {showTextArea ? (
                      <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-end'>
                        <input
                          type='text'
                          className='block w-full rounded-md border border-[#969696] bg-white py-2 px-3 text-sm text-prussianBlue'
                          value={newDocument}
                          onChange={(e) => setNewDocument(e.target.value)}
                          placeholder='Document name'
                        />
                        <EvaluatorDateField
                          id='trusteeNewDocumentDate'
                          label='Date'
                          value={newDocumentDate}
                          onChange={(e) => setNewDocumentDate(e.target.value)}
                          className='sm:w-48'
                        />
                        <button
                          type='button'
                          onClick={handleAddDocument}
                          className='rounded-md primary-gradient px-4 py-2 text-sm text-white'
                        >
                          Add
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <button
                    type='button'
                    onClick={handleSubmitRequests}
                    disabled={submitting}
                    className='primary-gradient text-white rounded-md px-5 py-2.5 text-sm disabled:opacity-50'
                  >
                    {submitting ? 'Sending...' : 'Send Requests'}
                  </button>
                </div>
              </>
            )
          ) : (
            <p className='text-sm text-gray-500'>
              Select a listing to request documents from the asset holder.
            </p>
          )}
        </div>

        <div className='md:px-10 px-5 py-7 border-t border-gray-100'>
          <h2 className='font-medium sm:text-lg text-base lg:text-xl text-prussianBlue mb-2'>
            Document Request History
          </h2>
          <p className='text-sm text-gray-600 mb-6'>
            All document requests across listings and their upload status.
          </p>

          <div className='custom-shadow rounded w-full max-w-full min-w-0 overflow-hidden'>
            <table className='w-full table-fixed text-xs sm:text-sm bg-white'>
              <thead>
                <tr className='primary-gradient text-white'>
                  <th className='py-2 px-2 text-left font-medium w-[14%]'>
                    Asset Type
                  </th>
                  <th className='py-2 px-2 text-left font-medium w-[18%]'>
                    Document
                  </th>
                  <th className='py-2 px-2 text-left font-medium w-[22%]'>
                    Listing
                  </th>
                  <th className='py-2 px-2 text-left font-medium w-[14%]'>
                    Date
                  </th>
                  <th className='py-2 px-2 text-left font-medium w-[14%]'>
                    Status
                  </th>
                  <th className='py-2 px-2 text-left font-medium w-[18%]'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingHistory ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='py-6 px-2 text-center text-gray-500'
                    >
                      Loading history...
                    </td>
                  </tr>
                ) : documentHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='py-6 px-2 text-center text-gray-500'
                    >
                      No document requests yet.
                    </td>
                  </tr>
                ) : (
                  documentHistory.map((entry) => {
                    const historyKey = `${entry.listingId}-${entry.requestIndex}`
                    const isOpening = openingHistoryKey === historyKey
                    const isUploaded = entry.status === 'Uploaded'

                    return (
                      <tr
                        key={historyKey}
                        className='border-t border-gray-200 hover:bg-gray-50'
                      >
                        <td
                          className='py-2 px-2 capitalize truncate'
                          title={formatDocumentAssetType(entry.assetType)}
                        >
                          {formatDocumentAssetType(entry.assetType)}
                        </td>
                        <td
                          className='py-2 px-2 capitalize truncate'
                          title={entry.name}
                        >
                          {entry.name}
                        </td>
                        <td
                          className='py-2 px-2 truncate'
                          title={entry.listingTitle}
                        >
                          {entry.listingTitle || '—'}
                        </td>
                        <td className='py-2 px-2 whitespace-nowrap'>
                          {entry.date
                            ? formatRequestDocumentDate(entry.date)
                            : '—'}
                        </td>
                        <td className='py-2 px-2'>
                          <span
                            className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${isUploaded
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                              }`}
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td className='py-2 px-2'>
                          {isUploaded ? (
                            <button
                              type='button'
                              disabled={isOpening}
                              onClick={() => handleViewHistoryDocument(entry)}
                              className='inline-flex items-center gap-1 text-prussianBlue hover:underline disabled:opacity-50'
                            >
                              <img
                                src='/icons/view.png'
                                alt='View document'
                                className='w-5 h-5'
                              />
                              <span>{isOpening ? 'Opening...' : 'View'}</span>
                            </button>
                          ) : (
                            <span className='text-xs text-gray-400'>
                              Awaiting upload
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Loader isOpen={submitting} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        fileUrl={pdfUrl}
        fileName={pdfFileName}
      />
    </>
  )
}
