export const propertyPricesForFilter = [
  { value: '500000', label: 'AED 500,000' },
  { value: '1000000', label: 'AED 1,000,000' },
  { value: '5000000', label: 'AED 5,000,000' },
  { value: '10000000', label: 'AED 10,000,000' },
  { value: '20000000', label: 'AED 20,000,000' },
  { value: '30000000', label: 'AED 30,000,000' },
  { value: '40000000', label: 'AED 40,000,000' },
  { value: '50000000', label: 'AED 50,000,000' },
]

export const boatPricesForFilter = [
  { value: '2000000', label: 'AED 2,000,000' },
  { value: '3000000', label: 'AED 3,000,000' },
  { value: '5000000', label: 'AED 5,000,000' },
  { value: '7000000', label: 'AED 7,500,000' },
  { value: '10000000', label: 'AED 10,000,000' },
]

export const defaultPricesForFilter = [
  { value: '50000', label: 'AED 50,000' },
  { value: '100000', label: 'AED 100,000' },
  { value: '500000', label: 'AED 500,000' },
  { value: '1000000', label: 'AED 1,000,000' },
  { value: '1500000', label: 'AED 1,500,000' },
  { value: '2000000', label: 'AED 2,000,000' },
]

export const times = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM',
]

export const asset = [
  { value: 'Property For Sale', link: 'property' },
  // { value: "Property For Lease", link: "property" },
  { value: 'Property Off Plan For Sale', link: 'property' },
  { value: 'Car For Sale', link: 'car' },
  { value: 'Jewellery For Sale', link: 'jewelry' },
  { value: 'Boats For Sale', link: 'boat' },
]

export const profileDocument = [
  {
    id: 1,
    name: 'Identification Documents:',
    value: ['Passport', "Driver's License", 'National ID Card'],
  },
  {
    id: 2,
    name: 'Proof of Address:',
    value: [
      'Utility bills (e.g., electricity, water, gas)',
      // "Bank statements",
      'Rental agreement or mortgage statement',
    ],
  },
  {
    id: 3,
    name: 'Financial Documents:',
    value: [
      'Bank statements',
      'Tax returns',
      'Proof of income (e.g., pay stubs, employment contract)',
    ],
  },
  {
    id: 4,
    name: 'Asset Ownership Documents:',
    value: [
      'Property deeds',
      'Vehicle registration documents',
      'Stock certificates',
    ],
  },
  {
    id: 5,
    name: ' Legal Documents:',
    value: ['Power of Attorney', 'Trust documents', 'Will and testament'],
  },
  {
    id: 6,
    name: 'Business Documents (if applicable):',
    value: [
      'Business registration/license',
      'Articles of incorporation',
      'Financial statements',
    ],
  },
  {
    id: 7,
    name: ' Insurance Documents:',
    value: ['Health insurance card', 'Property insurance policy'],
  },
  {
    id: 8,
    name: 'Legal Compliance Documents:',
    value: [
      'Anti-money laundering (AML) compliance documents',
      'Know Your Customer (KYC) information',
    ],
  },
]

export const options = [
  'Select',
  'Passport',
  "Driver's License",
  'National ID Card',
  'Utility bills (e.g., electricity, water, gas)',
  'Bank statements',
  'Rental agreement or mortgage statement',
  'Tax returns',
  'Proof of income',
  'Property deeds',
  'Vehicle registration documents',
  'Stock certificates',
  'Power of Attorney',
  'Trust documents',
  'Will and testament',
  'Business registration/license',
  'Articles of incorporation',
  'Financial statements',
  'Health insurance card',
  'Property insurance policy',
  'Anti-money laundering (AML) compliance documents',
  'Know Your Customer (KYC) information',
]

export const propertyTypes = [
  'Apartment',
  'Villa',
  'Townhouse',
  'Multiple',
  'Penthouse',
  'Residential Building',
  'Residential Floor',
  'Villa Compound',
]

export const tabs = [
  { name: 'Evaluation document pending', current: true },
  { name: 'Evaluation Complete', current: false },
  { name: 'Pending bank approval', current: false },
  { name: 'Bank Approval complete', current: false },
  { name: 'Asset transferred', current: false },
  { name: 'Case closed', current: false },
]
