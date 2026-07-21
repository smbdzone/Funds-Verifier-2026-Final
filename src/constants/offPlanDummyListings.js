const OFF_PLAN_IMAGE = '/offplan/image1.svg'

const basePaymentPlan = (steps) =>
  steps.map((step, index) => ({
    step: index + 1,
    stepLabel: `Step ${index + 1}`,
    paymentLabel: step.paymentLabel,
    sharePercent: String(step.sharePercent),
    milestone: step.milestone,
    icon: step.icon,
  }))

const FIGMA_PAYMENT_PLAN = basePaymentPlan([
  { paymentLabel: 'Booking', sharePercent: 20, milestone: 'On Booking', icon: 'booking' },
  {
    paymentLabel: 'Sales Agreement',
    sharePercent: 20,
    milestone: 'Within 30 Days',
    icon: 'sales-agreement',
  },
  {
    paymentLabel: 'Title Deed (DLD)',
    sharePercent: 20,
    milestone: 'On DLD Registration',
    icon: 'title-deed',
  },
  { paymentLabel: 'Handover', sharePercent: 20, milestone: 'On Handover', icon: 'handover' },
  {
    paymentLabel: 'Final Payment',
    sharePercent: 20,
    milestone: 'Post Handover',
    icon: 'final-payment',
  },
])

export const OFF_PLAN_DUMMY_LISTINGS = [
  {
    id: 'offplan-1',
    uuid: 'offplan-uuid-001',
    assetType: 'Property Off Plan For Sale',
    slug: 'perfect-place-of-villa',
    title: 'Perfect Place of Villa',
    location: 'Burj Khalifa District, Dubai, UAE',
    neighbourhood: 'Burj Khalifa District',
    city: 'Dubai',
    country: 'United Arab Emirates',
    deliveryLabel: 'Q4, 2041',
    deliveryQuarter: 'Q4',
    deliveryYear: '2041',
    paymentPlanLabel: '20/80 Payment Plan',
    rating: 0,
    reviewCount: 0,
    ref: '12390878',
    priceFrom: 25000,
    priceTo: 300000,
    images: [OFF_PLAN_IMAGE],
    developerAvatar: '/avatar/Avatars 2.png',
    developer: 'Emaar Properties',
    propertyType: 'Villa',
    bedrooms: 4,
    bathrooms: 5,
    sizeUnit: 'SQFT',
    sizeSQFT: 4200,
    layout: 'Open Plan',
    numberOfFloors: '2',
    description:
      'A premium off-plan villa community offering spacious layouts, private pools, and skyline views near Downtown Dubai.',
    additionalDescription:
      'This villa project features contemporary architecture, smart-home readiness, landscaped gardens, and direct access to retail and dining destinations. Ideal for end-users and long-term investors seeking a branded developer with a proven delivery track record.',
    facilities: [
      'Private Pool',
      'Shared Gym',
      'Covered Parking',
      'Concierge Service',
      'Balcony',
      'Built in Kitchen Appliances',
      'Security',
      'Central A/C',
    ],
    paymentPlan: FIGMA_PAYMENT_PLAN, unitLayout: OFF_PLAN_IMAGE,
    floorPlan: OFF_PLAN_IMAGE,
  },
  {
    id: 'offplan-2',
    uuid: 'offplan-uuid-002',
    assetType: 'Property Off Plan For Sale',
    slug: 'skyline-residence-tower',
    title: 'Skyline Residence Tower',
    location: 'Dubai Marina, Dubai, UAE',
    neighbourhood: 'Dubai Marina',
    city: 'Dubai',
    country: 'United Arab Emirates',
    deliveryLabel: 'Q2, 2040',
    deliveryQuarter: 'Q2',
    deliveryYear: '2040',
    paymentPlanLabel: '30/70 Payment Plan',
    rating: 0,
    reviewCount: 0,
    ref: '88452109',
    priceFrom: 450000,
    priceTo: 1200000,
    images: [OFF_PLAN_IMAGE],
    developerAvatar: '/avatar/Avatars 2.png',
    developer: 'Damac Properties',
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 3,
    sizeUnit: 'SQFT',
    sizeSQFT: 1450,
    layout: 'Duplex',
    numberOfFloors: '45',
    description:
      'High-rise waterfront residences with marina views, premium amenities, and flexible post-handover options.',
    additionalDescription:
      'Skyline Residence Tower includes infinity pool decks, co-working lounges, kids play areas, and direct marina promenade access. Units are available in 1–3 bedroom configurations with high-end kitchen packages and floor-to-ceiling glazing.',
    facilities: [
      'Shared Pool',
      'Shared Spa',
      'Covered Parking',
      'Gym',
      'View of Water',
      'Lobby in Building',
      'Retail Outlets',
      'Prayer Room',
    ],
    paymentPlan: basePaymentPlan([
      { paymentLabel: 'Booking', sharePercent: 30, milestone: 'On Booking', icon: 'booking' },
      {
        paymentLabel: 'Sales Agreement',
        sharePercent: 30,
        milestone: 'During Construction',
        icon: 'sales-agreement',
      },
      {
        paymentLabel: 'Final Payment',
        sharePercent: 40,
        milestone: 'On Handover',
        icon: 'final-payment',
      },
    ]),
    unitLayout: OFF_PLAN_IMAGE,
    floorPlan: OFF_PLAN_IMAGE,
  },
  {
    id: 'offplan-3',
    uuid: 'offplan-uuid-003',
    assetType: 'Property Off Plan For Sale',
    slug: 'palm-luxury-apartments',
    title: 'Palm Luxury Apartments',
    location: 'Palm Jumeirah, Dubai, UAE',
    neighbourhood: 'Palm Jumeirah',
    city: 'Dubai',
    country: 'United Arab Emirates',
    deliveryLabel: 'Q1, 2042',
    deliveryQuarter: 'Q1',
    deliveryYear: '2042',
    paymentPlanLabel: '10/90 Payment Plan',
    rating: 0,
    reviewCount: 0,
    ref: '55671234',
    priceFrom: 1800000,
    priceTo: 4500000,
    images: [OFF_PLAN_IMAGE],
    developerAvatar: '/avatar/Avatars 2.png',
    developer: 'Nakheel',
    propertyType: 'Penthouse',
    bedrooms: 3,
    bathrooms: 4,
    sizeUnit: 'SQFT',
    sizeSQFT: 3100,
    layout: 'Penthouse',
    numberOfFloors: '12',
    description:
      'Exclusive palm-facing residences with private beach access, luxury finishes, and resort-style amenities.',
    additionalDescription:
      'Palm Luxury Apartments offer signature interiors, private elevator access on select units, and curated wellness facilities. The project is designed for buyers seeking premium waterfront living with strong rental demand potential.',
    facilities: [
      'Private Beach Access',
      'Shared Pool',
      'Concierge Service',
      'Private Gym',
      'Maid Service',
      'Built in Wardrobes',
      'Barbeque Area',
      'Valet Parking',
    ],
    paymentPlan: basePaymentPlan([
      { paymentLabel: 'Booking', sharePercent: 10, milestone: 'On Booking', icon: 'booking' },
      {
        paymentLabel: 'Sales Agreement',
        sharePercent: 15,
        milestone: 'Foundation Complete',
        icon: 'sales-agreement',
      },
      {
        paymentLabel: 'Title Deed (DLD)',
        sharePercent: 15,
        milestone: 'Structure Complete',
        icon: 'title-deed',
      },
      { paymentLabel: 'Handover', sharePercent: 20, milestone: 'Facade Complete', icon: 'handover' },
      {
        paymentLabel: 'Final Payment',
        sharePercent: 40,
        milestone: 'On Handover',
        icon: 'final-payment',
      },
    ]),
    unitLayout: OFF_PLAN_IMAGE,
    floorPlan: OFF_PLAN_IMAGE,
  },
  {
    id: 'offplan-4',
    uuid: 'offplan-uuid-004',
    assetType: 'Property Off Plan For Sale',
    slug: 'creek-harbour-heights',
    title: 'Creek Harbour Heights',
    location: 'Dubai Creek Harbour, UAE',
    neighbourhood: 'Dubai Creek Harbour',
    city: 'Dubai',
    country: 'United Arab Emirates',
    deliveryLabel: 'Q3, 2041',
    deliveryQuarter: 'Q3',
    deliveryYear: '2041',
    paymentPlanLabel: '25/75 Payment Plan',
    rating: 0,
    reviewCount: 0,
    ref: '99120345',
    priceFrom: 320000,
    priceTo: 890000,
    images: [OFF_PLAN_IMAGE],
    developerAvatar: '/avatar/Avatars 2.png',
    developer: 'Emaar Properties',
    propertyType: 'Apartment',
    bedrooms: 1,
    bathrooms: 2,
    sizeUnit: 'SQFT',
    sizeSQFT: 980,
    layout: 'Studio Plus',
    numberOfFloors: '38',
    description:
      'Modern creek-side apartments with panoramic city views, family-friendly amenities, and excellent connectivity.',
    additionalDescription:
      'Creek Harbour Heights is positioned near Dubai Creek Marina and major road links. The development includes landscaped parks, cycling tracks, community retail, and flexible unit options for first-time buyers and investors.',
    facilities: [
      'Kids Play Area',
      'Covered Parking',
      'Shared Gym',
      'View of Landmark',
      'CCTV Security',
      'Maintenance Staff',
      'Storage Areas',
      'Recycling Facilities',
    ],
    paymentPlan: basePaymentPlan([
      { paymentLabel: 'Booking', sharePercent: 25, milestone: 'On Booking', icon: 'booking' },
      {
        paymentLabel: 'Title Deed (DLD)',
        sharePercent: 35,
        milestone: 'During Construction',
        icon: 'title-deed',
      },
      {
        paymentLabel: 'Final Payment',
        sharePercent: 40,
        milestone: 'On Handover',
        icon: 'final-payment',
      },
    ]),
    unitLayout: OFF_PLAN_IMAGE,
    floorPlan: OFF_PLAN_IMAGE,
  },
]

export function getOffPlanListingBySlug(slug) {
  return OFF_PLAN_DUMMY_LISTINGS.find((item) => item.slug === slug) || null
}

export function formatOffPlanPriceRange(priceFrom, priceTo) {
  const formatPart = (value) => {
    const amount = Number(value)
    if (!Number.isFinite(amount) || amount <= 0) return '0'

    if (amount >= 1_000_000) {
      const millions = amount / 1_000_000
      return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
    }

    if (amount >= 1_000) {
      const thousands = amount / 1_000
      return thousands % 1 === 0 ? `${thousands}k` : `${thousands.toFixed(0)}k`
    }

    return String(amount)
  }

  return `AED ${formatPart(priceFrom)}-${formatPart(priceTo)}`
}

export function formatOffPlanSizeRange(sizeFrom, sizeTo, sizeUnit = 'SQFT') {
  const formatPart = (value) => {
    const amount = Number(value)
    if (!Number.isFinite(amount) || amount <= 0) return '0'
    return Number.isInteger(amount)
      ? String(amount)
      : String(Number(amount.toFixed(2)))
  }

  const unit = sizeUnit === 'SQM' ? 'SQM' : 'SQFT'
  const from = formatPart(sizeFrom)
  const to = formatPart(sizeTo)

  if (from === '0' && to === '0') return `— ${unit}`
  if (!sizeTo || from === to || to === '0') return `${from} ${unit}`
  return `${from}-${to} ${unit}`
}
