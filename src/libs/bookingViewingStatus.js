export function normalizeViewingBookingStatus(status) {
  const normalized = String(status || 'open').trim().toLowerCase().replace(/\s+/g, '_')
  return normalized === 'under_process' ? 'under_process' : 'open'
}

export function isViewingBookingUnderProcess(status) {
  return normalizeViewingBookingStatus(status) === 'under_process'
}

export function formatViewingBookingStatus(status) {
  return isViewingBookingUnderProcess(status) ? 'Under process' : 'Open'
}

export function viewingBookingStatusBadgeClass(status) {
  if (isViewingBookingUnderProcess(status)) {
    return 'bg-amber-50 text-amber-900 ring-amber-600/20'
  }
  return 'bg-emerald-50 text-emerald-800 ring-emerald-600/15'
}
