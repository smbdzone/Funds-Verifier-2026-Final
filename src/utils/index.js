export function ucFirst(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Get the lowercase file extension from a URL or filename.
 *
 * Why a helper: signed URLs (CloudFront / S3 presigned) append a query string
 * like `?X-Amz-Algorithm=...&X-Amz-Signature=...`, and the previous
 * `url.split('.').pop()` returned the extension *plus* the entire query string
 * (e.g. `"pdf?x-amz-algorithm=..."`). That never matched `'pdf'` so PDF
 * modals fell through to "Unsupported file type." This strips the query and
 * hash first, then reads the trailing extension off the pathname only.
 */
export function getFileExtensionFromUrl(input) {
  if (typeof input !== "string" || input.length === 0) return "";
  // Drop query string and fragment before extracting the extension.
  const withoutQuery = input.split("?")[0].split("#")[0];
  if (/\/evaluation-certificate\/[^/]+\/pdf$/i.test(withoutQuery)) {
    return "pdf";
  }
  // Use the last path segment so dotted directory names don't fool us.
  const lastSegment = withoutQuery.substring(
    withoutQuery.lastIndexOf("/") + 1,
  );
  const dot = lastSegment.lastIndexOf(".");
  if (dot < 0 || dot === lastSegment.length - 1) return "";
  return lastSegment.slice(dot + 1).toLowerCase();
}

// utils/validation.js
export const validateForm = (formData, formFields) => {
  let errors = {};

  formFields.forEach((field) => {
    if (field.required && !formData[field.name]?.trim()) {
      errors[field.name] = `${field.placeholder || field.label} is required`;
    }
  });

  return errors;
};

export function formatPriceUS(price) {
  return new Intl.NumberFormat("en-US").format(price);
}

export const propertyExtras = [
  {
    id: 1,
    value: "Maids Room",
  },
  {
    id: 2,
    value: "Private Garden",
  },
  {
    id: 3,
    value: "Balcony",
  },
  {
    id: 4,
    value: "Study",
  },
  {
    id: 5,
    value: "Private Jacuzzi",
  },
  {
    id: 6,
    value: "Shared Pool",
  },
  {
    id: 7,
    value: "Security",
  },
  {
    id: 8,
    value: "Maid Service",
  },
  {
    id: 9,
    value: "Walk-in Closet",
  },
  {
    id: 10,
    value: "View of Water",
  },
  {
    id: 11,
    value: "Pets Allowed",
  },
  {
    id: 12,
    value: "Service Elevators",
  },
  {
    id: 13,
    value: "ATM Facility",
  },
  {
    id: 14,
    value: "Satellite / Cable TV",
  },
  {
    id: 15,
    value: "CCTV Security",
  },
  {
    id: 16,
    value: "Kids Play Area",
  },
  {
    id: 17,
    value: "Storage Areas",
  },
  {
    id: 18,
    value: "Waste Disposal",
  },
  {
    id: 19,
    value: "Private Pool",
  },
  {
    id: 20,
    value: "Concierge Service",
  },
  {
    id: 21,
    value: "Shared Spa",
  },
  {
    id: 22,
    value: "Private Gym",
  },
  {
    id: 23,
    value: "Covered Parking",
  },
  {
    id: 24,
    value: "Shared Gym",
  },
];

export const propertyForSale = {
  Residential: [
    {
      id: 1,
      value: "Apartment",
    },
    {
      id: 2,
      value: "Villa",
    },
    {
      id: 3,
      value: "Townhouse",
    },
    {
      id: 4,
      value: "Multiple",
    },
    {
      id: 5,
      value: "Penthouse",
    },
    {
      id: 6,
      value: "Residential Building",
    },
    {
      id: 7,
      value: "Residential Floor",
    },
    {
      id: 8,
      value: "Villa Compound",
    },
  ],

  Commercial: [
    {
      id: 1,
      value: "Office",
    },
    {
      id: 2,
      value: "Industrials",
    },
    {
      id: 3,
      value: "Retail",
    },
    {
      id: 4,
      value: "Staff Accommodation",
    },
    {
      id: 5,
      value: "Shop",
    },
    {
      id: 6,
      value: "Warehouse",
    },
    {
      id: 7,
      value: "Commercial Floor",
    },
    {
      id: 8,
      value: "Commercial Villa",
    },
    {
      id: 9,
      value: "Bulk Unit",
    },
    {
      id: 10,
      value: "Commercial Plot",
    },
    {
      id: 11,
      value: "Factory",
    },
    {
      id: 10,
      value: "Industrial Land",
    },
    {
      id: 10,
      value: "Mixed Use Land",
    },
    {
      id: 10,
      value: "Showroom",
    },
    {
      id: 10,
      value: "Commercial Building",
    },
    {
      id: 10,
      value: "Other",
    },
  ],
  land: "Land",
  multiple: "Multiple",
};

export const carForSale = [
  {
    id: 1,
    value: "Abarth",
  },
  {
    id: 2,
    value: "Acura",
  },
  {
    id: 3,
    value: "Alfa Romeo",
  },
  {
    id: 4,
    value: "Ariel",
  },
  {
    id: 5,
    value: "Aston Martin",
  },
  {
    id: 6,
    value: "Audi",
  },
  {
    id: 7,
    value: "Austin-Healey",
  },
  {
    id: 8,
    value: "Avatr",
  },
  {
    id: 9,
    value: "BAC",
  },
  {
    id: 10,
    value: "BAIC",
  },
  {
    id: 11,
    value: "Bentley",
  },
  {
    id: 12,
    value: "Bentley Onyx",
  },
  {
    id: 13,
    value: "Bestune",
  },
  {
    id: 14,
    value: "Bizzarrini",
  },
  {
    id: 15,
    value: "Fortuner",
  },
  {
    id: 16,
    value: "Prado",
  },
  {
    id: 17,
    value: "Hiace",
  },
  {
    id: 18,
    value: "4Runner",
  },
  {
    id: 19,
    value: "FJ Cruiser",
  },
  {
    id: 20,
    value: "Land Cruiser",
  },
];

export const jewellryForSale = {
  Necklace: [
    {
      id: 1,
      value: "Collar Necklace",
    },
    {
      id: 2,
      value: "Locket",
    },
    {
      id: 3,
      value: "Box Chain",
    },
    {
      id: 4,
      value: "Rope Chain",
    },
    {
      id: 5,
      value: "Long Necklace",
    },
    {
      id: 6,
      value: "Princess Necklace",
    },
  ],
  Rings: [
    {
      id: 1,
      value: "Cocktail rings",
    },
    {
      id: 2,
      value: "Signet rings",
    },
    {
      id: 3,
      value: "Ceramic rings",
    },
  ],
  Earring: [
    {
      id: 1,
      value: "Stud Earrings",
    },
    {
      id: 2,
      value: "Solitaire Earrings",
    },
    {
      id: 3,
      value: "Hoop Earrings",
    },
    {
      id: 4,
      value: "Huggie Earrings",
    },
  ],
  Bracelet: [
    {
      id: 1,
      value: "Charm Bracelets",
    },
    {
      id: 2,
      value: "Beaded Bracelets",
    },
    {
      id: 3,
      value: "Bangle Bracelets",
    },
    {
      id: 4,
      value: "Cuff Bracelets",
    },
  ],
};

export const carBrands = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Sports Car",
  "Volkswagen",
  "Nissan",
  "Hyundai",
  "Kia",
  "Lexus",
  "Subaru",
  "Mazda",
  "Jaguar",
  "Land Rover",
  "Porsche",
  "Ferrari",
  "Lamborghini",
  "Tesla",
  "Volvo",
  "Mitsubishi",
  "Buick",
  "Cadillac",
  "Chrysler",
  "Dodge",
  "GMC",
  "Jeep",
  "Infiniti",
  "Acura",
  "Lincoln",
  "Alfa Romeo",
  "Bentley",
  "Maserati",
  "Rolls-Royce",
  "Aston Martin",
  "Mini",
  "Fiat",
  "Peugeot",
  "Citroën",
  "Renault",
  "Skoda",
  "Seat",
  "Suzuki",
  "Isuzu",
  "Saab",
  "Genesis",
  "McLaren",
  "Pagani",
  "Bugatti",
];
