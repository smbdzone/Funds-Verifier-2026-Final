'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const OTP_LENGTH = 6

const onlyDigits = (value) => String(value ?? '').replace(/\D/g, '')

/**
 * Step 2 of sign-in for OTP-gated roles: 6-digit code from email with a
 * 30 second resend countdown.
 */
const LoginOtpStep = ({
  email,
  maskedEmail,
  resendInSeconds = 30,
  onVerify,
  onResend,
  onBack,
}) => {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [secondsLeft, setSecondsLeft] = useState(resendInSeconds)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const inputsRef = useRef([])

  const code = digits.join('')
  const isComplete = code.length === OTP_LENGTH

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  const focusInput = (index) => {
    const clamped = Math.max(0, Math.min(OTP_LENGTH - 1, index))
    inputsRef.current[clamped]?.focus()
    inputsRef.current[clamped]?.select?.()
  }

  const submitCode = useCallback(
    async (value) => {
      if (value.length !== OTP_LENGTH || verifying) return
      setError('')
      setVerifying(true)
      try {
        await onVerify(value)
      } catch (err) {
        setError(
          err?.response?.data?.message ??
          'That code did not work. Please try again.',
        )
        setDigits(Array(OTP_LENGTH).fill(''))
        focusInput(0)
      } finally {
        setVerifying(false)
      }
    },
    [onVerify, verifying],
  )

  const handleChange = (index, rawValue) => {
    const value = onlyDigits(rawValue)
    const next = [...digits]

    if (!value) {
      next[index] = ''
      setDigits(next)
      return
    }

    // Typing or autofilling several digits fills the boxes to the right.
    const chunk = value.slice(0, OTP_LENGTH - index)
    chunk.split('').forEach((digit, offset) => {
      next[index + offset] = digit
    })

    setDigits(next)
    focusInput(index + chunk.length)

    const filled = next.join('')
    if (filled.length === OTP_LENGTH) submitCode(filled)
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      event.preventDefault()
      const next = [...digits]
      if (next[index]) {
        next[index] = ''
      } else if (index > 0) {
        next[index - 1] = ''
        focusInput(index - 1)
      }
      setDigits(next)
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusInput(index - 1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusInput(index + 1)
    }
  }

  const handlePaste = (event) => {
    const pasted = onlyDigits(event.clipboardData.getData('text')).slice(
      0,
      OTP_LENGTH,
    )
    if (!pasted) return
    event.preventDefault()

    const next = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((digit, index) => {
      next[index] = digit
    })
    setDigits(next)
    focusInput(pasted.length)
    if (pasted.length === OTP_LENGTH) submitCode(pasted)
  }

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return
    setError('')
    setResending(true)
    try {
      const data = await onResend()
      setDigits(Array(OTP_LENGTH).fill(''))
      focusInput(0)
      setSecondsLeft(data?.resendInSeconds ?? resendInSeconds)
    } catch (err) {
      const wait = err?.response?.data?.resendInSeconds
      if (wait) setSecondsLeft(wait)
      setError(
        err?.response?.data?.message ?? 'Could not resend the code right now.',
      )
    } finally {
      setResending(false)
    }
  }

  const countdown = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
    const seconds = String(secondsLeft % 60).padStart(2, '0')
    return `${minutes}:${seconds}`
  }, [secondsLeft])

  const progress =
    resendInSeconds > 0
      ? Math.min(1, Math.max(0, secondsLeft / resendInSeconds))
      : 0
  const RADIUS = 18
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  return (
    <div className='w-[85%] xl:w-[60%] flex flex-col gap-6 items-center'>
      <div className='flex flex-col items-center gap-3 text-center'>
        <div className='h-14 w-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center'>
          <svg
            width='26'
            height='26'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.6'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-white'
            aria-hidden='true'
          >
            <rect x='2.5' y='4.5' width='19' height='15' rx='2.5' />
            <path d='M3 7l9 6 9-6' />
          </svg>
        </div>

        <h2 className='font-semibold text-2xl'>Check your email</h2>
        <p className='text-sm text-slate-200 leading-relaxed'>
          We sent you an email with a 6-digit verification code to{' '}
          <span className='font-semibold text-white'>
            {maskedEmail || email}
          </span>
          . Enter it below to finish signing in.
        </p>
      </div>

      <div className='flex gap-2 sm:gap-3' onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element
            }}
            type='text'
            inputMode='numeric'
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={OTP_LENGTH}
            aria-label={`Digit ${index + 1}`}
            disabled={verifying}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onFocus={(event) => event.target.select()}
            className={`h-14 w-11 sm:h-16 sm:w-12 rounded-xl bg-white/10 text-center text-2xl font-semibold text-white outline-none transition-all
              border ${error
                ? 'border-red-400'
                : digit
                  ? 'border-white'
                  : 'border-white/30'
              }
              focus:border-white focus:bg-white/20 focus:ring-2 focus:ring-white/30
              disabled:opacity-60`}
          />
        ))}
      </div>

      {error && (
        <p className='text-sm text-red-400 text-center -mt-2'>{error}</p>
      )}

      <button
        type='button'
        onClick={() => submitCode(code)}
        disabled={!isComplete || verifying}
        className={`w-full bg-white text-prussianBlue rounded-full py-2.5 font-semibold flex items-center justify-center gap-2 transition-opacity ${!isComplete || verifying ? 'opacity-60 cursor-not-allowed' : ''
          }`}
      >
        {verifying ? (
          <div className='h-5 w-5 border-2 border-prussianBlue border-t-transparent rounded-full animate-spin' />
        ) : (
          'Verify & Sign In'
        )}
      </button>

      <div className='flex flex-col items-center gap-3'>
        {secondsLeft > 0 ? (
          <div className='flex items-center gap-3 text-sm text-slate-200'>
            <span className='relative inline-flex h-11 w-11 items-center justify-center'>
              <svg
                className='absolute inset-0 -rotate-90'
                width='44'
                height='44'
                viewBox='0 0 44 44'
                aria-hidden='true'
              >
                <circle
                  cx='22'
                  cy='22'
                  r={RADIUS}
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='3'
                />
                <circle
                  cx='22'
                  cy='22'
                  r={RADIUS}
                  fill='none'
                  stroke='#ffffff'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <span className='text-xs font-semibold text-white'>
                {secondsLeft}
              </span>
            </span>
            <span>
              You can request a new code in{' '}
              <span className='font-semibold text-white'>{countdown}</span>
            </span>
          </div>
        ) : (
          <button
            type='button'
            onClick={handleResend}
            disabled={resending}
            className='text-sm font-semibold text-white hover:underline disabled:opacity-60'
          >
            {resending ? 'Sending a new code…' : 'Resend verification code'}
          </button>
        )}

        <button
          type='button'
          onClick={onBack}
          className='text-sm text-slate-300 hover:text-white hover:underline'
        >
          Use a different account
        </button>
      </div>
    </div>
  )
}

export default LoginOtpStep
