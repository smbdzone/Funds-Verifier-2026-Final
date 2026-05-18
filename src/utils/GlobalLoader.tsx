import { Loader2Icon } from 'lucide-react'
import React from 'react'

export default function GlobalLoader() {
    return (
        <div className='flex justify-center items-center h-96'>
            <Loader2Icon className='animate-spin' />
        </div>
    )
}
