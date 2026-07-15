import { PlusIcon } from '@/components/Icons'
import EvaluatorDateField from './EvaluatorDateField'

/**
 * Aligned row: Add More Documents | name | date | Add | Request
 */
export default function RequestDocumentsActions({
  showTextArea,
  setShowTextArea,
  newDocument,
  setNewDocument,
  newDocumentDate,
  setNewDocumentDate,
  onAdd,
  onRequest,
}) {
  const controlClass =
    'h-12 rounded-md border border-[#8d7c3b] bg-white text-sm text-gray-800 focus:outline-none sm:text-base'

  return (
    <div className='mb-5 flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
      <div className='flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
        <button
          type='button'
          onClick={() => setShowTextArea(!showTextArea)}
          className={`${controlClass} inline-flex shrink-0 items-center gap-2 px-3 text-prussianBlue`}
        >
          <span className='flex h-6 w-6 items-center justify-center rounded-full bg-prussianBlue text-white'>
            <PlusIcon />
          </span>
          <span className='whitespace-nowrap'>Add More Documents</span>
        </button>

        {showTextArea ? (
          <>
            <input
              type='text'
              value={newDocument}
              onChange={(e) => setNewDocument(e.target.value)}
              placeholder='Document name'
              className={`${controlClass} w-full min-w-0 px-3 sm:max-w-[220px] sm:flex-1`}
            />
            <EvaluatorDateField
              id='newDocumentDate'
              label=''
              value={newDocumentDate}
              onChange={(e) => setNewDocumentDate(e.target.value)}
              className='w-full sm:w-44'
            />
            <button
              type='button'
              onClick={onAdd}
              className='primary-gradient inline-flex h-12 shrink-0 items-center justify-center rounded-md px-5 text-sm font-medium text-white sm:text-base'
            >
              Add
            </button>
          </>
        ) : null}
      </div>

      <button
        type='button'
        onClick={onRequest}
        className='primary-gradient inline-flex h-12 w-full shrink-0 items-center justify-center rounded-md px-6 text-sm font-medium text-white sm:w-auto sm:text-base lg:ml-3'
      >
        Request
      </button>
    </div>
  )
}
