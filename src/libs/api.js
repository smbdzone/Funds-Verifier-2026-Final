
if (!process.env.NEXT_PUBLIC_BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not available. Please check your environment configuration.");
}

const root = process.env.NEXT_PUBLIC_BASE_URL;

export const api = `${root}/api/`;
//
export const routes = {
  // car listing api
  carListing: `${api}car`,
  boatListing: `${api}boat`,
  jewelryListing: `${api}jewelry`,
  propertyListing: `${api}property`,
  createAssets: `${api}create-assets`,

  // upload product Imgs
  uploadImages: `${api}upload-img`,
};
