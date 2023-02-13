import { PaperClipIcon } from '@heroicons/react/20/solid'
import { projectStatus, projectType, priority } from '@/config/modules/projects'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

export default function Overview({ project }) {

    const router = useRouter()
    const { workspaceSlug, id } = router.query

    const prio = priority.find((a) => a.id === project.projectType).name
    const type = projectType.find((a) => a.id === project.projectType).name
    const status = projectStatus.find((a) => a.id === project.projectStatus).name

    return (
        <div className="mt-10">
            <div>
                <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Project Details</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Project details and project management.</p>
                </div>
                <div className="mt-5 border-t border-gray-200">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500">Project Name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{project.projectName}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500">Project Status</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <span className={`inline-flex items-center rounded-md ${status === "Completed" ? "bg-green-600 text-gray-200" : "bg-gray-100 text-yellow-800"}  px-2.5 py-0.5 text-sm font-medium `}>
                                    {status}
                                </span>
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500">Project Type</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <span className={`inline-flex items-center rounded-md ${type === "Mobile App" ? "bg-teal-600 text-gray-200" : "bg-gray-100 text-yellow-800"}  px-2.5 py-0.5 text-sm font-medium `}>
                                    {type}
                                </span>
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500">Priority</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <span className={`inline-flex items-center rounded-md ${prio === "Low" ? "bg-red-400 text-gray-200" : "bg-gray-100 text-yellow-800"}  px-2.5 py-0.5 text-sm font-medium `}>
                                    {prio}
                                </span>
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500">Project Owner</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{project.projectOwner}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500">Assigned to</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{project.assignedTo}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{project.startDate}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500">End Date</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{project.endDate}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500">Resolution</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{project.resolution}</dd>
                        </div>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/deals/card/${project.deal.id}`}>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Associated Deal</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex justify-between">
                                    <p>
                                        {project.deal.dealName}
                                    </p>
                                    <p>
                                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                    </p>
                                </dd>
                            </div>
                        </Link>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/card/${project?.deal?.contact?.id}`}>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Associated Contact</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex justify-between">
                                    <p>
                                        {project.deal?.contact?.firstName + ' ' + project.deal?.contact?.lastName}
                                    </p>
                                    <p>
                                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                    </p>
                                </dd>
                            </div>
                        </Link>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/companies/card/${project.deal.company?.id}`}>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Associated Company</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex justify-between">
                                    <p>
                                        {project.deal.company?.companyName}
                                    </p>
                                    <p>
                                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                    </p>
                                </dd>
                            </div>
                        </Link>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                {project.description}
                            </dd>
                        </div>
                        {project.ProjectItemDocuments.length > 0 &&
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                                        {project.ProjectItemDocuments.map((item, index) => (
                                            <li key={index} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                                                <div className="flex w-0 flex-1 items-center">
                                                    <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    <span className="ml-2 w-0 flex-1 truncate">{item.name}</span>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                    <a href={item.fileUrl} className="font-medium text-red-600 hover:text-red-500">
                                                        Download
                                                    </a>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                        }
                    </dl>
                </div>
            </div>
        </div>
    );
}


