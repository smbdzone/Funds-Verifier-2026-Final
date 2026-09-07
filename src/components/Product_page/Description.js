import React from 'react'

/**
 * Renders listing description / additional description as paragraphs,
 * preserving newlines the user entered in the textarea.
 */
function Description({ text }) {
  if (text == null || text === '') {
    return null
  }

  const paragraphs = String(text)
    .replace(/\r\n/g, '\n')
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (!paragraphs.length) {
    return null
  }

  return (
    <div className='w-full space-y-3 rounded-lg py-3 text-xs text-prussianBlue sm:px-5 md:text-base'>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className='whitespace-pre-wrap break-words leading-relaxed'
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}

export default Description
