'use client'

import { useState } from 'react'
import EvaluatorDateField from '@/components/modules/EvaluatorProfile/requestCompoenets/EvaluatorDateField'

export function useHistoryEvaluatedFilters() {
  const [nameQuery, setNameQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')

  const resetHistoryFilters = () => {
    setNameQuery('')
    setDateFrom('')
    setDateTo('')
    setSortOrder('newest')
  }

  const historyFilters = { nameQuery, dateFrom, dateTo, sortOrder }
  const historyFiltersActive = Boolean(
    nameQuery.trim() || dateFrom || dateTo || sortOrder !== 'newest',
  )

  return {
    nameQuery,
    setNameQuery,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    sortOrder,
    setSortOrder,
    historyFilters,
    historyFiltersActive,
    resetHistoryFilters,
  }
}

const inputClass =
  'block h-12 w-full rounded-md border border-[#8d7c3b] bg-white px-3 text-sm text-gray-800 focus:outline-none sm:text-base'

export default function HistoryEvaluatedFilters({
  nameQuery,
  onNameQueryChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  sortOrder,
  onSortOrderChange,
  onReset,
  showReset = false,
}) {
  return (
    <div className='mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
      <div className='min-w-0'>
        <label
          htmlFor='history-evaluated-name'
          className='mb-2 block text-sm font-medium text-gray-700 sm:text-base'
        >
          Name
        </label>
        <input
          id='history-evaluated-name'
          type='search'
          value={nameQuery}
          onChange={(e) => onNameQueryChange(e.target.value)}
          placeholder='Search by title'
          className={inputClass}
        />
      </div>
      <EvaluatorDateField
        id='history-evaluated-from'
        label='From date'
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
      />
      <EvaluatorDateField
        id='history-evaluated-to'
        label='To date'
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
      />
      <div className='min-w-0'>
        <label
          htmlFor='history-evaluated-sort'
          className='mb-2 block text-sm font-medium text-gray-700 sm:text-base'
        >
          Sort
        </label>
        <div className='flex items-center gap-2'>
          <select
            id='history-evaluated-sort'
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value)}
            className={inputClass}
          >
            <option value='newest'>Newest first</option>
            <option value='oldest'>Oldest first</option>
          </select>
          {showReset ? (
            <button
              type='button'
              onClick={onReset}
              className='h-12 shrink-0 rounded-md border border-[#8d7c3b] px-3 text-sm text-[#002d4f] hover:bg-slate-50'
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
