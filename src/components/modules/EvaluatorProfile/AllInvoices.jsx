import React, { useEffect, useState } from 'react'
import DocumentSection from './requestCompoenets/DocumentSection'
import Modal from '../../documents/modal'
import axios from 'axios'
import { usePathname } from 'next/navigation'

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
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/boat`, {
            cache: 'no-store',
          }),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/property`, {
            cache: 'no-store',
          }),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/car`, {
            cache: 'no-store',
          }),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jewelry`, {
            cache: 'no-store',
          }),
        ])

      if (
        !boatResponse.ok ||
        !propertyResponse.ok ||
        !carResponse.ok ||
        !jewelryResponse.ok
      ) {
        throw new Error('Failed to fetch listings data')
      }

      const [boatData, propertyData, carData, jewelryData] = await Promise.all([
        boatResponse.json(),
        propertyResponse.json(),
        carResponse.json(),
        jewelryResponse.json(),
      ])

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
