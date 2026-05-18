import customAxios from "@/utils/apis/apis";

export default async function fetchUser(userUUID) {
  try {
    const response = await customAxios.get(`/assetHolder/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}
