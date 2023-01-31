import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import { dealStage } from '@/config/modules/crm';
import { AccountLayout } from '@/layouts/index';
import { log } from '@/lib/client/log';
import api from '@/lib/common/api';
import { getDeal, getActivity, getDocuments, getTicket, getCRMSettings } from '@/prisma/services/modules';
import { CheckIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import moment from 'moment';
import Button from '@/components/Button';
import { getSession } from 'next-auth/react';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { getMembers } from '@/prisma/services/membership';
import Select from '@/components/Select';
import Activity from '@/components/modules/customer-cloud/deals/Activities';
import { contactActivity } from '@/lib/client/log';
import Tickets from '@/components/modules/customer-cloud/deals/Tickets';
import Documents from '@/components/modules/customer-cloud/deals/Documents';
import Quotes from '@/components/modules/customer-cloud/deals/Quotes';
import Finance from '@/components/modules/customer-cloud/deals/Finance';
import Reports from '@/components/modules/customer-cloud/deals/Reports';
import { useForm, Controller } from "react-hook-form";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Deal({ deal, team, activities, documents, workspace, tickets, settings }) {
    deal = JSON.parse(deal)
    team = JSON.parse(team)
    activities = JSON.parse(activities)

    const router = useRouter(false);
    const { workspaceSlug, id, tab } = router.query;

    const tabs = [
        { name: 'Overview', href: 'overview', current: tab === 'overview' || !tab ? true : false },
        { name: 'Activity', href: 'activity', current: tab === 'activity' ? true : false },
        { name: 'Tickets', href: 'tickets', current: tab === 'tickets' ? true : false },
        { name: 'Documents', href: 'documents', current: tab === 'documents' ? true : false },
        { name: 'Invoices', href: 'quotes', current: tab === 'quotes' ? true : false },
        { name: 'Finance', href: 'finance', current: tab === 'tasks' ? true : false },
        { name: 'Reports', href: 'reports', current: tab === 'reports' ? true : false },
    ]



    const updateDeal = async (formInput) => {
        const res = await api(`/api/modules/deal`, {
            method: 'POST',
            body: {
                formInput,
                workspaceId: workspace[0].id,
                moduleId: modules.id
            }
        })
        if (res.status === 200) {
            toast.success('Deal created successfully')
            writeLog()
            router.replace(router.asPath)

        } else {
            toast.error('Error creating Deal')
        }
    }

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Deals | Dashboard`} />
            <Content.Title
                title={deal.dealName}
                subtitle={dealStage.find((d) => d.id === deal.dealStage)?.name}
            />
            <Content.Container>
                <nav aria-label="Progress">
                    <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
                        {dealStage.slice(parseFloat(deal.dealStage) - 1, parseFloat(deal.dealStage) + 5).map((step, stepIdx) => (
                            <li key={step.name} className="relative md:flex md:flex-1">
                                {step.id < deal.dealStage ? (
                                    <a href={step.href} className="group flex w-full items-center">
                                        <span className="flex items-center px-6 py-4 text-xs font-medium">
                                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-600 group-hover:bg-red-800">
                                                <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </span>
                                            <span className="ml-4 text-xs font-medium text-gray-500">{step.name}</span>
                                        </span>
                                    </a>
                                ) : step.id === deal.dealStage ? (
                                    <a href={step.href} className="flex items-center px-6 py-4 text-xs font-medium" aria-current="step">
                                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-red-600">
                                            <span className="text-red-600">{step.id}</span>
                                        </span>
                                        <span className="ml-4 text-xs font-medium text-red-600">{step.name}</span>
                                    </a>
                                ) : (
                                    <a href={step.href} className="group flex items-center">
                                        <span className="flex items-center px-6 py-4 text-xs font-medium">
                                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-100 group-hover:border-gray-100">
                                                <span className="text-gray-500 group-hover:text-gray-500">{step.id}</span>
                                            </span>
                                            <span className="ml-4 text-xs font-medium text-gray-500 group-hover:text-gray-500">{step.name}</span>
                                        </span>
                                    </a>
                                )}

                                {stepIdx !== 5 ? (
                                    <>
                                        {/* Arrow separator for lg screens and up */}
                                        <div className="absolute top-0 right-0 hidden h-full w-5 md:block" aria-hidden="true">
                                            <svg
                                                className="h-full w-full text-gray-300"
                                                viewBox="0 0 22 80"
                                                fill="none"
                                                preserveAspectRatio="none"
                                            >
                                                <path
                                                    d="M0 -2L20 40L0 82"
                                                    vectorEffect="non-scaling-stroke"
                                                    stroke="currentcolor"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </>
                                ) : null}
                            </li>
                        ))}
                    </ol>
                </nav>
                {/* Tabs */}
                <div className="mt-8 sm:mt-2 2xl:mt-5">
                    <div className="border-b border-gray-100">
                        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {tabs.map((tab) => (
                                    <Link
                                        key={tab.name}
                                        href={`/account/${workspaceSlug}/modules/customer-cloud/deals/card/${id}?tab=${tab.href}`}
                                        className={classNames(
                                            tab.current
                                                ? 'border-red-500 text-gray-500'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                        )}
                                        aria-current={tab.current ? 'page' : undefined}
                                    >
                                        {tab.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
                {tab === undefined &&
                    <Overview deal={deal} team={team} settings={settings} />
                }
                {tab === "activity" &&
                    <>
                        <Activity activities={activities} />
                    </>
                }
                {tab === "tickets" &&
                    <>
                        <Tickets deal={deal} tickets={tickets} team={team} />
                    </>
                }
                {tab === "documents" &&
                    <Documents deal={deal} documents={documents} />
                }
                {tab === "quotes" &&
                    <Quotes settings={settings} deal={deal} />
                }
                {tab === "finance" &&
                    <Finance />
                }
                {tab === "reports" &&
                    <Reports />
                }
                {tab === "overview" &&
                    <Overview deal={deal} team={team} settings={settings} />
                }
            </Content.Container >
        </AccountLayout >
    )
}

export default Deal


const Overview = ({ deal, team, settings }) => {
    settings = JSON.parse(settings)[0]
    const router = useRouter()
    const { workspaceSlug, id } = router.query
    const [assign, updateAssign] = useState("")

    const defaultValues = {
        userId: deal?.aassignedTo ? deal?.aassignedTo : '',
        dealId: id
    }

    const { handleSubmit, control, setValue, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => assignDeal(data);

    //assigne deal to user
    const assignDeal = async (data) => {
        const res = await api(`/api/modules/customer-cloud/deal`, {
            method: 'POST',
            body: {
                dealId: id,
                userId: data.assign
            }
        })
        if (res.status === 200) {
            toast.success('Deal assigned successfully')
            await writeLog(`Reassigned to ${team.find((t) => t.user.id === assign)?.email}`, "assigned_to", new Date(), id)
            router.replace(router.asPath)
        } else {
            toast.error('Error assigning Deal')
        }
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-4 border p-4">
                <div className="mt-8 col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-500">Deal Details</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Overview of Deal.</p>
                </div>
                <div className="mt-5 col-span-2 border-t border-gray-200">
                    <dl className="grid grid-cols-2 gap-4  sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                            <dt className="text-sm font-medium text-gray-500">Deal name</dt>
                            <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{deal.dealName}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                            <dt className="text-sm font-medium text-gray-500">Deal Type</dt>
                            <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{deal.dealType}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                            <dt className="text-sm font-medium text-gray-500">Amount</dt>
                            <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{parseFloat(deal.amount)?.toLocaleString(settings.country, { style: "currency", currency: settings.currency })}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                            <dt className="text-sm font-medium text-gray-500">Close Date</dt>
                            <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{moment(deal.closeDate).format("DD MMM. YYYY")}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                            <dt className="text-sm font-medium text-gray-500">Priority</dt>
                            <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{deal.priority.toUpperCase()}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                            <dt className="text-sm font-medium text-gray-500">Updated at</dt>
                            <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{moment(deal.updatedAat).format("DD MMM. YYYY - hh:mm:ss")}</dd>
                        </div>
                    </dl>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <form onSubmit={handleSubmit(onSubmit)} className="py-4 items-center flex gap-4 col-span-2" >
                    <p className="w-20 text-xs">Assign to:</p>
                    <Controller
                        name="userId"
                        id="userId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select
                                {...field}                            >
                                {team.map((member, index) => (
                                    <option key={index} value={member.user.id} >
                                        {member.user.name}
                                    </option>
                                ))}

                            </Select>
                        )}
                    />

                    <Button className="w-20 bg-red-600 text-white" type="submit">Assign</Button>
                </form>
            </div >
            <div>
                <div className="grid grid-cols-2 gap-4 border-gray-200 border p-4">
                    {deal?.contact &&
                        <div className="mt-8 col-span-1">
                            <h3 className="text-lg font-medium leading-6 text-gray-500">Contact Information</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details.</p>
                        </div>
                    }
                    {deal?.company &&
                        <div className="mt-8 col-span-1">
                            <h3 className="text-lg font-medium leading-6 text-gray-500">Company Information</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details.</p>
                        </div>
                    }
                    {deal?.contact &&
                        <div className="mt-5 border-t border-gray-100">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/card/${deal?.contact?.id}`}>
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                                        <dt className="text-sm font-medium text-gray-500">Full name</dt>

                                        <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{deal?.contact?.firstName + ' ' + deal?.contact?.lastName}</dd>
                                    </div>
                                </Link>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                                    <dt className="text-sm font-medium text-gray-500">Street</dt>
                                    <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{deal?.contact?.street}</dd>
                                </div>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                                    <dt className="text-sm font-medium text-gray-500">Zip & City</dt>
                                    <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{deal?.contact?.zip + ' ' + deal?.contact?.city}</dd>
                                </div>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                    <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{deal?.contact?.phone}</dd>
                                </div>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{deal?.contact?.email}</dd>
                                </div>

                            </dl>
                        </div>
                    }
                    {deal?.company &&
                        <div className="mt-5 border-t border-gray-100">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <Link href={`/account/${workspaceSlug}/modules/customer-cloud/companies/card/${deal?.company?.id}`}>
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                                        <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                                        <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{deal?.company?.companyName}</dd>
                                    </div>
                                </Link>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                                    <dt className="text-sm font-medium text-gray-500">Street</dt>
                                    <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{deal?.company?.street}</dd>
                                </div>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                                    <dt className="text-sm font-medium text-gray-500">Zip & City</dt>
                                    <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{deal?.company?.zip + ' ' + deal?.company?.city}</dd>
                                </div>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                    <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{deal?.company?.phone}</dd>
                                </div>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{deal?.company?.email}</dd>
                                </div>
                            </dl>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}


const writeLog = async (type, action, date, contactId) => {
    const res = await contactActivity(`${type}`, `${type} at ${date}`, `${action.toLowerCase()}`, '127.0.0.1', contactId);
}


export async function getServerSideProps(context) {

    const session = await getSession(context);

    //These two variables are initialized as false and null respectively. 
    //They are used to store whether the current user is a team owner and the current workspace.
    let isTeamOwner = false;
    let workspace = null;

    if (session) {
        workspace = await getWorkspace(
            session.user.userId,
            session.user.email,
            context.params.workspaceSlug
        );

        if (workspace) {
            isTeamOwner = isWorkspaceOwner(session.user.email, workspace);
        }
    }



    //This retrieves the module data using the getModule function and assigns it to the modules variable. 
    //It takes the id from the params property of the context object.

    const team = await getMembers(context.query.workspaceSlug)
    const activities = await getActivity(context.params.id)
    const documents = await getDocuments(context.params.id)
    const deal = await getDeal(context.params.id);
    const tickets = await getTicket(context.params.id)

    const settings = await getCRMSettings(deal.module.id)

    return {
        props: {
            deal: JSON.stringify(deal),
            team: JSON.stringify(team),
            activities: JSON.stringify(activities),
            documents: JSON.stringify(documents),
            workspace: JSON.stringify(workspace),
            tickets: JSON.stringify(tickets),
            settings: JSON.stringify(settings)

        }
    }
}