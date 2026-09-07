const isSameCalendarDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export function toLocalCalendarDate(value) {
  if (!value) return null
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate())
  }
  if (typeof value === 'string') {
    const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    }
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())
}

/** Parse slot labels like "08:00 AM" / "12:30 PM" on a calendar day. */
export function parseSlotTimeOnDate(selectedDate, timeString) {
  if (!selectedDate || !timeString) return null

  const match = String(timeString)
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return null

  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3].toUpperCase()

  if (period === 'AM') {
    if (hours === 12) hours = 0
  } else if (hours !== 12) {
    hours += 12
  }

  const slotDate = toLocalCalendarDate(selectedDate)
  if (!slotDate) return null

  slotDate.setHours(hours, minutes, 0, 0)
  return slotDate
}

/** Hide times earlier than now when the selected day is today. */
export function filterPastTimeSlotsForDate(slots, selectedDate, now = new Date()) {
  if (!Array.isArray(slots) || !selectedDate) return []

  const date = toLocalCalendarDate(selectedDate)
  const today = toLocalCalendarDate(now)
  if (!date) return slots
  if (!today || !isSameCalendarDay(date, today)) return slots

  return slots.filter((slot) => {
    const timeString = typeof slot === 'string' ? slot : slot?.time
    if (!timeString) return false

    const slotDateTime = parseSlotTimeOnDate(date, timeString)
    if (!slotDateTime) return true

    return slotDateTime.getTime() > now.getTime()
  })
}

export function filterPastTimeLabelsForDate(timeLabels, selectedDate, now = new Date()) {
  return filterPastTimeSlotsForDate(
    (timeLabels || []).map((time) => ({ time })),
    selectedDate,
    now,
  ).map((slot) => slot.time)
}

export function getBookableSlotsForDate(slots, selectedDate, now = new Date()) {
  const openSlots = (slots || []).filter((slot) => slot && !slot.isBooked)
  return filterPastTimeSlotsForDate(openSlots, selectedDate, now)
}
