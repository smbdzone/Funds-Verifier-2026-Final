import React from 'react'
import customAxios from '../../utils/apis/apis'

const NotificationPopup = ({ isOpen, onClose, details }) => {
  const [propertyListings, setPropertyListings] = useState([])

  const fetchListingsData = async () => {
    try {
      const [boatResponse, propertyResponse, carResponse, jewelryResponse] =
        await Promise.all([
          customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/boat`),
          customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/property`),
          customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/car`),
          customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/jewelry`),
        ])

      setPropertyListings(propertyResponse.data)
    } catch (error) {
      console.error('Error fetching listing data:', error)
    }
  }

  useEffect(() => {
    fetchListingsData()
  }, [])

  const renderPropertyListings = () => {
    return propertyListings.map((item) => {
      const createdAt = new Date(item.createdAt)
      const currentTime = new Date()
      const timeDifference = Math.abs(currentTime - createdAt) / 36e5 // Difference in hours

      return (
        <div key={item.uuid} className='property-item'>
          {timeDifference <= 5 && item.status === 0 && (
            <div>
              <p>Property Add request: {item.title}</p>
              <button
                className='text-sm py-2.5 px-5 border-2 rounded-md text-white primary-gradient'
                onClick={() => handleApprove(item.uuid)}
              >
                Approve
              </button>
              <button
                className='text-sm py-2.5 px-5 border-2 rounded-md text-white primary-gradient'
                onClick={() => handleReject(item.uuid)}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      )
    })
  }

  if (!isOpen) return null // Do not render if not open

  const handleApprove = async (itemId) => {
    try {
      await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/property/${itemId}`,
        { status: 1 }
      )
      setPropertyListings((prevListings) =>
        prevListings.map((item) =>
          item.uuid === itemId ? { ...item, status: 1 } : item
        )
      )
    } catch (error) {
      console.error('Error approving item:', error)
    }
  }

  return (
    <>
      <div className='fixed inset-0 bg-black/50 z-40' onClick={onClose}></div>
      <div>{renderPropertyListings()}</div>
      <div className='fixed inset-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg w-[400px] h-[300px] z-50'>
        <h3 className='text-xl font-semibold mb-4'>Request Assets</h3>
        <p>{details}</p>
        <button
          className='text-sm py-2.5 px-5 border-2 rounded-md text-white primary-gradient'
          onClick={onClose}
        >
          Aprove Asset
        </button>
      </div>
    </>
  )
}

export default NotificationPopup
