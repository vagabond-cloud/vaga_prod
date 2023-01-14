import { useState } from 'react'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

function Reload() {
    const router = useRouter();

    const backToAccount = () => {
        router.replace(`/account`);
    }

    return (
        <div className="flex h-screen justify-center items-center">
            <div className="text-center w-96 h-96 p-10 border-dashed rounded-lg border-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="mx-auto h-12 w-12 text-gray-400 my-6" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z" />
                </svg>

                <h3 className="mt-2 text-sm font-medium text-gray-900">Reload disabled!</h3>
                <p className="mt-1 text-sm text-gray-500">Go back to overview.</p>
                <div className="mt-6">
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={backToAccount}
                    >
                        <ArrowUturnLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Back
                    </button>
                </div>

            </div>

        </div>
    )
}

export default Reload