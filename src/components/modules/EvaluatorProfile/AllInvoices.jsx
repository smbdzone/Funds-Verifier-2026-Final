import React, { useEffect, useState } from 'react'
import DocumentSection from './requestCompoenets/DocumentSection'
import Modal from '../../documents/modal'
import axios from 'axios'
import { usePathname } from 'next/navigation'
import customAxios from '@/utils/apis/apis'

const AllInvoices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [allListings, setAllListings] = useState([])
  const [pdfUrl, setPdfUrl] = useState('')
  const path = usePathname()
  const handleOpenDoc = (url) => {
    setPdfUrl(url)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }
  async function fetchListingsData() {
    try {
      const [boatResponse, propertyResponse, carResponse, jewelryResponse] =
        await Promise.all([
          customAxios.get('/boat'),
          customAxios.get('/property'),
          customAxios.get('/car'),
          customAxios.get('/jewelry'),
        ])

      const boatData = boatResponse.data
      const propertyData = propertyResponse.data
      const carData = carResponse.data
      const jewelryData = jewelryResponse.data

      const filteredBoatListings = boatData.products.filter(
        (item) => item.status === 1
      )
      const filteredPropertyListings = propertyData.products.filter(
        (item) => item.status === 1
      )
      const filteredCarListings = carData.products.filter(
        (item) => item.status === 1
      )
      const filteredJewelryListings = jewelryData.products.filter(
        (item) => item.status === 1
      )
      setAllListings([
        ...filteredPropertyListings,
        ...filteredBoatListings,
        ...filteredCarListings,
        ...filteredJewelryListings,
      ])
    } catch (error) {
      console.error('Error fetching listings:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchListingsData()
  }, [])
  const allInvoices = allListings
    ?.filter((item) => item?.invoice) // Filter items with valid invoices
    .map((item) => item.invoice) // Map to get the invoices

  return (
    <div>
      <DocumentSection
        title='All Invoices'
        documents={allInvoices}
        handleOpenDoc={handleOpenDoc}
      />
      <Modal isOpen={isModalOpen} onClose={closeModal} fileUrl={pdfUrl} />
    </div>
  )
}

export default AllInvoices
