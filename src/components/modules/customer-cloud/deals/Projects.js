import React from 'react'
import moment from 'moment'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { projectType, projectStatus, priority } from '@/config/modules/projects'

function Projects({ deal }) {
    const projects = deal?.Project

    const router = useRouter()
    const { workspaceSlug, id } = router.query

    return (
        <div>
            <div className="w-full px-4 mt-10">
                {projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
                    <Link href={`/account/${workspaceSlug}/modules/customer-cloud/projects/board/${item.id}`} key={index} className="">
                        <div className="p-4 cursor-pointer pointer-events-auto w-full max-w-full overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100">
                            <div className="flex items-between">
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium text-gray-900">{item.projectName} </p>
                                    </div>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{projectType.find((t) => t.id === item.projectType).name}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{moment(item.createdAt).format("DD MMM. YYYY - hh:mm:ss")}</p>

                                </div>
                                <div className="flex pt-0.5 items-center justify-end">
                                    <p className="text-sm font-medium text-green-600 mr-6">{projectStatus.find((s) => s.id === item.projectStatus).name} </p>

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
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Projects