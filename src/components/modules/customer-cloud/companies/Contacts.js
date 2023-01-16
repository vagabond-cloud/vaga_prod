import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

function Contacts({ company }) {
    const router = useRouter()
    const { workspaceSlug } = router.query

    return (
        <div className="w-full px-4 mt-10">
            {company.contacts.sort((a, b) => { new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() }).reverse().map((item, index) => (
                <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/card/${item.id}`} key={index}>
                    <div className="cursor-pointer pointer-events-auto w-full max-w-7xl overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100">
                        <div className="p-4">
                            <div className="flex items-between">
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">{item.firstName + ' ' + item.lastName}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{item.phone}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{item.email}</p>

                                </div>

                                <div className="ml-4 flex flex-shrink-0">
                                    <div className="block w-full">
                                        <button
                                            type="button"
                                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        >
                                            <span className="sr-only">Close</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
export default Contacts