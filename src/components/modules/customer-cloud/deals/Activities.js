import { useState, useEffect } from 'react'
import moment from 'moment'
import api from '@/lib/common/api'
import { useRouter } from 'next/router'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

function Activites({ activities }) {


    const router = useRouter();
    const { workspaceSlug, id } = router.query;

    const [activity, setActivitiy] = useState(activities)
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        nextPage()
    }, [pageIndex])

    const nextPage = async () => {
        const res = await api(`/api/modules/activities?id=${id}&page=${pageIndex}`, {
            method: 'GET'
        })
        setActivitiy(res.log)
    }
    const handlePageIndex = (number) => {
        if (number < 1) return;
        if (number > activities?.allActivities?.length / 10 - 1) return;
        setPageIndex(number)
    }

    return (
        <div className="w-full px-4 mt-10">

            {activity.activities.map((item, index) => (
                <div key={index} className="cursor-pointer pointer-events-auto w-full max-w-7xl overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100">
                    <div className="p-4">
                        <div className="flex items-between">
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-400 truncate pr-8 my-2">{item.description}</p>
                                <p className="text-xs text-gray-400 truncate pr-8 my-2">{moment(item.createdAt).format("DD MMM. YYYY - hh:mm:ss")}</p>

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
            ))}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div>

                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{pageIndex === 0 ? 1 : pageIndex * 10 + 1}</span> to <span className="font-medium">{pageIndex === 0 ? 10 : pageIndex * 10 + 10 > activities?.allActivities?.length ? activities?.allActivities?.length : pageIndex * 10 + 10} {' '}of {' '}</span>
                        <span className="font-medium">{activities?.allActivities?.length}</span> results
                    </p>
                </div>
                <div className="flex flex-1 justify-between sm:hidden">
                    <a
                        onClick={() => handlePageIndex(pageIndex - 1)}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Previous
                    </a>
                    <a
                        onClick={() => handlePageIndex(pageIndex + 1)}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Next
                    </a>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>

                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <a
                                onClick={() => handlePageIndex(pageIndex - 1)}
                                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </a>
                            {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}

                            <a
                                onClick={() => handlePageIndex(pageIndex + 1)}
                                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Activites