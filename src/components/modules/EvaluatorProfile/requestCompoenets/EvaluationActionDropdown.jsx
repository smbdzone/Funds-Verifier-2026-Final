'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const MENU_ESTIMATE_HEIGHT = 120

export default function EvaluationActionDropdown({
  open,
  onClose,
  anchorRef,
  children,
  className = 'w-52 min-w-[12rem]',
}) {
  const menuRef = useRef(null)
  const [position, setPosition] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useLayoutEffect(() => {
    if (!open || !anchorRef?.current) {
      setPosition(null)
      return
    }

    const updatePosition = () => {
      const rect = anchorRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const openUpward = spaceBelow < MENU_ESTIMATE_HEIGHT + 12

      setPosition({
        top: openUpward ? rect.top - 8 : rect.bottom + 8,
        right: Math.max(8, window.innerWidth - rect.right),
        transform: openUpward ? 'translateY(-100%)' : undefined,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, anchorRef])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event) => {
      const target = event.target
      if (
        anchorRef?.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      onClose()
    }

    const handleClick = (event) => {
      const target = event.target
      if (
        anchorRef?.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      onClose()
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose, anchorRef])

  if (!mounted || !open || !position) return null

  return createPortal(
    <div
      ref={menuRef}
      role='menu'
      style={{
        position: 'fixed',
        top: position.top,
        right: position.right,
        transform: position.transform,
        zIndex: 9999,
      }}
      className={`${className} rounded-lg border border-gray-200 bg-white py-1 shadow-xl ring-1 ring-black/5`}
    >
      {children}
    </div>,
    document.body,
  )
}

export const evaluationMenuItemClass =
  'block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-slate-50 transition-colors first:rounded-t-lg last:rounded-b-lg'
