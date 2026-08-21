'use client'

import { useState } from 'react'

const capitalizeFirstLetter = (value) => {
  const text = String(value ?? '')
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Optional two-tone colour entries (e.g. red/black) with a + button.
 */
export default function ColorTwoToneField({
  title = 'Exterior Two Tone',
  values = [],
  onChange,
  placeholder = 'e.g. red/black',
  className = 'mt-4',
}) {
  const [showInput, setShowInput] = useState(false)
  const [draft, setDraft] = useState('')

  const list = Array.isArray(values) ? values.filter(Boolean) : []

  const addValue = () => {
    const val = capitalizeFirstLetter(draft.trim())
    if (!val) return
    const exists = list.some((item) => item.toLowerCase() === val.toLowerCase())
    if (!exists) {
      onChange?.([...list, val])
    }
    setDraft('')
    setShowInput(false)
  }

  const removeValue = (item) => {
    onChange?.(list.filter((v) => v !== item))
  }

  return (
    <div className={className}>
      <div className='mb-2 flex items-center gap-2'>
        <h2 className='text-dark-black text-xl font-medium'>{title}</h2>
        <button
          type='button'
          onClick={() => setShowInput((v) => !v)}
          className='flex h-5 w-5 items-center justify-center rounded-full border border-[#8d7c3b] text-sm font-bold text-[#8d7c3b] hover:bg-[#8d7c3b]/10'
          title={`Add ${title.toLowerCase()}`}
          aria-label={`Add ${title}`}
        >
          +
        </button>
      </div>

      {showInput ? (
        <div className='mb-2 flex flex-wrap items-center gap-2'>
          <input
            type='text'
            value={draft}
            onChange={(e) => setDraft(capitalizeFirstLetter(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addValue()
              }
            }}
            placeholder={placeholder}
            className='h-9 w-full max-w-[220px] rounded border border-[#8d7c3b]/40 bg-white px-3 text-sm text-[#002D4F] outline-none placeholder:text-xs placeholder:text-light-black shadow-neonsm'
          />
          <button
            type='button'
            onClick={addValue}
            className='h-9 rounded border border-[#8d7c3b] px-3 text-sm font-medium text-[#8d7c3b] hover:bg-[#8d7c3b]/10'
          >
            Add
          </button>
        </div>
      ) : null}

      {list.length ? (
        <div className='flex flex-wrap gap-2'>
          {list.map((item) => (
            <span
              key={item}
              className='inline-flex items-center gap-1 rounded-full border border-[#8d7c3b]/40 bg-[#faf8f3] px-3 py-1 text-xs text-[#002D4F]'
            >
              {item}
              <button
                type='button'
                onClick={() => removeValue(item)}
                className='ml-1 text-sm leading-none text-[#8d7c3b]'
                aria-label={`Remove ${item}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className='text-xs text-dark-grey/60'>
          Optional — click + to add a two-tone colour (example: red/black)
        </p>
      )}
    </div>
  )
}
