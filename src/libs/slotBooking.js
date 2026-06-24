import customAxios from '@/utils/apis/apis'

export const SERVICE_SLOT_FIELDS = [
  'slotTimeslotId',
  'slotDate',
  'slotTime',
  'slotTimeslots',
]

/** Remove appointment slot fields from 3D / technical-report modal state. */
export function clearServiceSlotFields(data) {
  if (!data || typeof data !== 'object') return data
  const next = { ...data, dateTime: '' }
  for (const key of SERVICE_SLOT_FIELDS) {
    delete next[key]
  }
  return next
}

/** Unbook a service slot on the server (3D / technical report calendar). */
export async function releaseServiceTimeslot({
  timeslotId,
  slotDate,
  slotTime,
  timeslots,
}) {
  if (!timeslotId || !slotTime || !Array.isArray(timeslots)) return

  const released = timeslots.map((slot) =>
    slot.time === slotTime ? { ...slot, isBooked: false } : slot,
  )

  try {
    await customAxios.put(`/arrange-view/timeslot/update/${timeslotId}`, {
      timeSlots: released,
      ...(slotDate ? { date: slotDate } : {}),
    })
  } catch (error) {
    console.error('Could not release timeslot:', error?.message)
  }
}

/** Clear local slot state and release the server booking if one was made. */
export async function clearServiceAppointmentSelection(formData, setFormData) {
  if (formData?.slotTimeslotId && formData?.slotTime) {
    await releaseServiceTimeslot({
      timeslotId: formData.slotTimeslotId,
      slotDate: formData.slotDate,
      slotTime: formData.slotTime,
      timeslots: formData.slotTimeslots,
    })
  }

  if (typeof setFormData === 'function') {
    setFormData((prev) => clearServiceSlotFields(prev))
  }
}
