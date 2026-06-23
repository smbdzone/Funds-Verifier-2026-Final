'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import vectorArrow from '@/assets/images/vector5.svg'

export function formatCityLabel(city) {
  if (!city) return ''
  const main = String(city).split(',')[0]?.trim()
  return main || String(city).trim()
}

export default function HeroFilterSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select',
  disabled = false,
  loading = false,
  emptyLabel = 'No options available',
  getOptionLabel = (opt) => opt?.label ?? opt?.value ?? opt,
  getOptionValue = (opt) => opt?.value ?? opt,
  className = '',
  title,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (disabled) setOpen(false)
  }, [disabled])

  useEffect(() => {
    const onOtherOpen = (e) => {
      if (e.detail !== rootRef.current) setOpen(false)
    }
    window.addEventListener('hero-filter-select-open', onOtherOpen)
    return () => window.removeEventListener('hero-filter-select-open', onOtherOpen)
  }, [])

  const toggleOpen = () => {
    if (disabled || loading) return
    window.dispatchEvent(
      new CustomEvent('hero-filter-select-open', { detail: rootRef.current }),
    )
    setOpen((prev) => !prev)
  }

  const selected = options.find((opt) => getOptionValue(opt) === value)
  const display = selected
    ? getOptionLabel(selected)
    : loading
      ? 'Loading…'
      : placeholder

  return (
    <div
      ref={rootRef}
      className={`select-wrapper hero-filter-select relative ${className}`}
    >
      <button
        type='button'
        disabled={disabled || loading}
        className='select-custom hero-filter-select__trigger outline-none'
        onClick={toggleOpen}
        aria-expanded={open}
        aria-haspopup='listbox'
        title={title || (selected ? getOptionLabel(selected) : placeholder)}
      >
        <span className='hero-filter-select__value'>{display}</span>
      </button>

      {loading && (
        <span
          className='absolute right-9 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-reefGold/30 border-t-reefGold rounded-full animate-spin pointer-events-none'
          aria-hidden
        />
      )}

      <div className='select-arrow'>
        <Image src={vectorArrow} alt='' width={12} height={12} />
      </div>

      {open && !disabled && (
        <ul className='hero-filter-select__menu' role='listbox' style={{ zIndex: 70 }}>
          {options.length > 0 ? (
            options.map((opt) => {
              const optValue = getOptionValue(opt)
              const isSelected = optValue === value
              return (
                <li
                  key={optValue}
                  role='option'
                  aria-selected={isSelected}
                  className={isSelected ? 'is-selected' : undefined}
                  title={optValue}
                  onClick={() => {
                    onChange(optValue)
                    setOpen(false)
                  }}
                >
                  {getOptionLabel(opt)}
                </li>
              )
            })
          ) : (
            <li className='hero-filter-select__empty' role='presentation'>
              {loading ? 'Loading…' : emptyLabel}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
