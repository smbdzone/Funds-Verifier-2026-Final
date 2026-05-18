import axios from 'axios'

export async function GetUserIpAddress() {
  try {
    const responseIp = await axios.get('https://api.ipify.org?format=json')
    const ip = responseIp?.data?.ip || null
    return ip
  } catch (error) {
    return null
  }
}
