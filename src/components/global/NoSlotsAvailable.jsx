import Link from 'next/link'

const COPY = {
  evaluation: {
    title: 'No evaluation slots for this date',
    body: 'The evaluator has no open times on this day. Please pick another date on the calendar.',
    hint: 'Need help booking sooner?',
  },
  viewing: {
    title: 'No viewing slots for this date',
    body: 'There are no available viewing times on this day. Try selecting a different date.',
    hint: 'Need to arrange a viewing urgently?',
  },
  service: {
    title: 'No appointment slots for this date',
    body: 'This service provider has no open times on the selected day. Please try another date.',
    hint: 'Having trouble scheduling?',
  },
  default: {
    title: 'No slots available for this date',
    body: 'Please choose another date on the calendar to see available times.',
    hint: 'Still unable to book?',
  },
}

export function NoSlotsAvailable({
  variant = 'default',
  theme = 'light',
  className = '',
}) {
  const copy = COPY[variant] || COPY.default
  const isDark = theme === 'dark'

  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-4 py-4 min-h-[8rem] ${className}`}
      role='status'
    >
      <p
        className={`font-semibold text-sm md:text-base mb-2 ${
          isDark ? 'text-white' : 'text-[#002D4F]'
        }`}
      >
        {copy.title}
      </p>
      <p
        className={`text-xs md:text-sm max-w-[280px] leading-relaxed mb-3 ${
          isDark ? 'text-white/90' : 'text-gray-600'
        }`}
      >
        {copy.body}
      </p>
      <p
        className={`text-xs max-w-[300px] leading-relaxed ${
          isDark ? 'text-white/80' : 'text-gray-500'
        }`}
      >
        {copy.hint}{' '}
        <Link
          href='/contact'
          className={`font-semibold underline underline-offset-2 ${
            isDark
              ? 'text-white hover:text-white/90'
              : 'text-[#8D7C3B] hover:text-[#6f6130]'
          }`}
        >
          Contact us
        </Link>{' '}
        and our team will assist you.
      </p>
    </div>
  )
}

export default NoSlotsAvailable
