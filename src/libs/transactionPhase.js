export const TRANSACTION_PHASE_LABELS = {
  under_process: 'Under process',
  awaiting_payment: 'Awaiting success fee',
  payment_proof_received: 'Payment proof received',
  transferred: 'Transferred',
}

export const formatTransactionPhase = (phase) =>
  TRANSACTION_PHASE_LABELS[phase] || phase || '—'

export const transactionPhaseBadgeClass = (phase) => {
  switch (phase) {
    case 'transferred':
      return 'bg-green-50 text-green-800 ring-green-200'
    case 'payment_proof_received':
      return 'bg-blue-50 text-blue-800 ring-blue-200'
    case 'awaiting_payment':
      return 'bg-amber-50 text-amber-800 ring-amber-200'
    case 'under_process':
      return 'bg-slate-100 text-slate-700 ring-slate-200'
    default:
      return 'bg-gray-50 text-gray-600 ring-gray-200'
  }
}

export const formatAssetLabel = (row) => {
  const title = row?.title || 'Untitled'
  const area = row?.neighbourhood ? ` · ${row.neighbourhood}` : ''
  return `${title}${area}`
}
