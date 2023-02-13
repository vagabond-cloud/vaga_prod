import { ChevronRightIcon } from '@heroicons/react/24/solid';
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

export default function Projects({ deal }) {

    const router = useRouter()
    const { workspaceSlug, id } = router.query


    return (
        <div>
            {deal.deal.map((deal, index) => {

                return (
                    <div key={index} className="w-full px-4 pt-4">
                        <div className="mx-auto w-fullrounded-md bg-white p-2">
                            <Disclosure>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex w-full  h-14 items-center justify-between rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
                                            <span>{deal.dealName}</span>
                                            <ChevronUpIcon
                                                className={`${open ? 'rotate-180 transform' : ''
                                                    } h-5 w-5 text-gray-500`}
                                            />
                                        </Disclosure.Button>
                                        {deal?.Project?.length === 0 ?
                                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                No Projects available for this Deal
                                            </Disclosure.Panel>
                                            :
                                            deal?.Project?.map((item, index) => {
                                                return (
                                                    <Disclosure.Panel key={index} className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                        <Link key={index} href={`/account/${workspaceSlug}/modules/customer-cloud/projects/board/${item.id}`}>
                                                            <div className="cursor-pointer pointer-events-auto w-full max-w-7xl overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100">
                                                                <div className="p-4">
                                                                    <div className="flex items-between">
                                                                        <div className="ml-3 w-0 flex-1 pt-0.5">
                                                                            <p className="text-sm font-medium text-gray-900">{item.projectName}</p>
                                                                            <p className="text-xs text-gray-400 truncate pr-8 my-2">{item.projectStatus}</p>
                                                                            <p className="text-xs text-gray-400 truncate pr-8 my-2">{moment(item.createdAt).format("DD MMM. YYYY - hh:mm:ss")}</p>
                                                                        </div>
                                                                        <div className="flex pt-0.5 items-center justify-end">
                                                                            <ChevronRightIcon className="h-5 w-5 text-gray-800" />
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
                                                    </Disclosure.Panel>
                                                )
                                            })
                                        }
                                    </>
                                )}
                            </Disclosure>

                        </div>
                    </div>
                )
            })}
        </div>
    )
}
