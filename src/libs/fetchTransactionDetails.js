import { confirmServicePayment } from '@/libs/confirmServicePayment'

const fetchTransactionData = async (sessionId) => {
  const raw =
    typeof sessionId === 'string'
      ? sessionId.replace(/^"|"$/g, '').trim()
      : sessionId
  return confirmServicePayment(raw)
}

export { fetchTransactionData }
