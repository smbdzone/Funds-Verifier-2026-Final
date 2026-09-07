'use client'

import React from 'react'

export class ViewerDetailsErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error('ViewerDetails render error:', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div className='w-full bg-white p-6'>
          <button
            type='button'
            className='mb-4 rounded-lg border border-[#002d4f] px-3 py-1.5 text-sm font-medium text-[#002d4f]'
            onClick={this.props.onClose}
          >
            Close
          </button>
          <h2 className='mb-2 text-lg font-bold text-red-600'>
            Could not display booking details
          </h2>
          <p className='text-sm text-slate-600'>
            {this.state.error?.message || 'Something went wrong while rendering this view.'}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
