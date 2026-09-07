import customAxios from '@/utils/apis/apis'

export async function initiateClozerPayment(payload) {
  const response = await customAxios.post('/clozer/initiate', payload)
  return response.data
}

export async function fetchClozerTransactionStatus(transactionId) {
  const response = await customAxios.get(`/clozer/status/${transactionId}`)
  return response.data
}

export async function fetchMyInstallments() {
  const response = await customAxios.get('/clozer/my-installments')
  return response.data
}

export function getClozerErrorMessage(error) {
  const data = error?.response?.data
  if (data?.code === 'EMIRATES_ID_REQUIRED') {
    return 'Add your Emirates ID in Profile before paying by installments.'
  }
  return data?.message || error?.message || 'Payment could not be started.'
}
