export default function EvaluationTableStatusRow({
  loading = false,
  isEmpty = false,
  emptyMessage = 'No pending evaluations.',
  colSpan = 4,
}) {
  if (loading) {
    return (
      <tr>
        <td colSpan={colSpan} className='px-4 py-10'>
          <div className='flex flex-col items-center justify-center gap-3'>
            <div
              className='h-8 w-8 animate-spin rounded-full border-2 border-[#A2913E] border-t-transparent'
              aria-hidden
            />
            <span className='text-sm text-gray-500'>Loading evaluations…</span>
          </div>
        </td>
      </tr>
    )
  }

  if (isEmpty) {
    return (
      <tr>
        <td colSpan={colSpan} className='px-4 py-6 text-sm text-gray-500'>
          {emptyMessage}
        </td>
      </tr>
    )
  }

  return null
}
