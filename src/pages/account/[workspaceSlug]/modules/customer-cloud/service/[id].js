import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import SlideOver from '@/components/SlideOver';
import { dealStage, ticketStatus, ticketSource } from '@/config/modules/crm';
import { AccountLayout } from '@/layouts/index';
import { log } from '@/lib/client/log';
import { contactActivity } from '@/lib/client/log';

import api from '@/lib/common/api';
import { getCompanies, getOwnersTickets, getDealContacts, getModule } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useForm, Controller } from "react-hook-form";
import Button from '@/components/Button';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function Contacts({ modules, companies, workspace, tickets, contacts, filters, total }) {
    modules = JSON.parse(modules)
    companies = JSON.parse(companies)
    workspace = JSON.parse(workspace)
    tickets = JSON.parse(tickets)
    contacts = JSON.parse(contacts)

    const settings = modules.Crmsettings[0]

    const router = useRouter(false);
    const { workspaceSlug, id, page } = router.query;


    const defaultValues = {
        dealName: '',
        pipeline: '',
        dealStage: '',
        amount: '',
        closeDate: '',
        dealOwnerId: '',
        dealType: '',
        priority: '',
        linkContactId: '',
        linkCompanyId: '',
        linkProjectId: '',
    }

    const { handleSubmit, control, setValue, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => createDeal(data);

    //This function creates a deal using the API. 
    //It uses the PUT method to send formInput, workspaceId, and moduleId to the API. 
    //If the status is 200, it will display a success message and write a log. 
    //If there is an error, it will display an error message.
    const createDeal = async (formInput) => {
        try {
            const { status } = await api(`/api/modules/deal`, {
                method: 'PUT',
                body: {
                    formInput,
                    workspaceId: workspace[0].id,
                    moduleId: modules.id
                }
            });
            if (status === 200) {
                toast.success('Deal created successfully');
                writeLog();
                router.replace(router.asPath);
            }
        } catch (error) {
            toast.error('Error creating Deal');
        }
    };

    const writeLog = async () => {
        const res = await log('Deal created', `Deal with the name ${defaultValues.dealName} created for Module: ${id} `, 'deal_created', '127.0.0.1');
    }

    //This is a function that handles changes to the filter. 
    //It takes in a single argument, e, which is an event object.
    //handleFilterChange is a callback function that is invoked on the filter change event, it replaces the current route with the new route with the filter value or without the filter value based on its value.

    const handleFilterChange = (e) => {

        //This destructures the target property of the event object to extract the value variable. 
        //This variable represents the current value of the filter.
        const { value } = e.target;

        //This is a conditional statement that checks if the current value of the filter is "All".
        if (value === 'All') {

            //If the value is "All", it uses the router.replace function to redirect to the /account/${workspaceSlug}/modules/customer-cloud/tickets/${id} route. workspaceSlug and id are variables that should be defined in the parent scope.
            router.replace(`/account/${workspaceSlug}/modules/customer-cloud/service/${id}`)

            //If the value is not "All", it uses the router.replace function to redirect to the /account/${workspaceSlug}/modules/customer-cloud/service/${id}?filter=${value} route, which appends the current value of the filter to the URL as a query string parameter.
        } else {
            router.replace(`/account/${workspaceSlug}/modules/customer-cloud/service/${id}?filter=${value}`)
        }
    };


    return (
        <AccountLayout>
            <Meta title={`Vagabond - Deals | Dashboard`} />
            <Content.Title
                title="Service"
                subtitle="Overview of your tickets"
            />
            <Content.Divider />
            <Content.Container>
                <div className="mt-4">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-xl font-semibold text-gray-900">Tickets</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                A list of all the tickets in your account including their contacts, and companies.
                            </p>
                        </div>
                        {/* <SlideOver
                            title="Add Deal"
                            subTitle="Add a new deal to your account"
                            buttonTitle="Add Deal"
                        >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="overflow-scroll h-full pb-20">
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="dealName"
                                            id="dealName"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="Deal Name"
                                                />
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="pipeline"
                                            id="pipeline"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="Pipeline"
                                                />
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.pipeline?.type === 'required' && <p role="alert">Pipeline is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="dealStage"
                                            id="dealStage"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Deal Stage"
                                                >
                                                    {
                                                        dealStage.map((stage, index) => (
                                                            <option key={index} value={stage.id}>{stage.name}</option>
                                                        )
                                                        )}
                                                </Select>
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.dealStage?.type === 'required' && <p role="alert">Deal stage is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="amount"
                                            id="amount"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="Amount"
                                                />
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.amount?.type === 'required' && <p role="alert">Amount is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="closeDate"
                                            id="closeDate"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="date"
                                                    label="Close Date"
                                                />
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.closeDate?.type === 'required' && <p role="alert">Close date is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="dealType"
                                            id="dealType"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Deal Type"
                                                >
                                                    <option value="">Choose Type</option>
                                                    <option value="New Business">New Business</option>
                                                    <option value="Existing Business">Existing Business</option>

                                                </Select>
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.contact?.type === 'required' && <p role="alert">Contact is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="priority"
                                            id="priority"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Priority"
                                                >
                                                    <option value="">Choose Priority</option>
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">Heigh</option>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="contactId"
                                            id="contactId"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Associate with"
                                                >
                                                    <option value="">Choose Contact</option>
                                                    {
                                                        contacts.map((stage, index) => (
                                                            <option key={index} value={stage.id}>{stage.firstName + ' ' + stage.lastName}</option>
                                                        )
                                                        )}
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller

                                            name="companyId"
                                            id="companyId"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Company"
                                                >
                                                    <option value="">Choose Company</option>
                                                    {
                                                        companies.map((stage, index) => (
                                                            <option key={index} value={stage.id}>{stage.companyName}</option>
                                                        )
                                                        )}
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="projectId"
                                            id="projectId"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Project"
                                                >
                                                    <option value="">Choose Project</option>
                                                    {
                                                        types.map((stage, index) => (
                                                            <option key={index} value={stage.id}>{stage.name}</option>
                                                        )
                                                        )}
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-shrink-0 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white">
                                    <Button
                                        type="submit"
                                        className="ml-4 inline-flex justify-center  rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Save
                                    </Button>
                                </div>

                            </form>
                        </SlideOver> */}
                    </div>
                    <div className="flex mt-2">
                        <div className="grid grid-cols-1 gap-4 mt-2">
                            <Select
                                onChange={(e) => handleFilterChange(e)}
                                className="w-60"
                            >
                                <option value="All">Status</option>
                                {
                                    ticketStatus.map((stage, index) => (
                                        <option key={index} value={stage.id}>{stage.label}</option>

                                    ))}
                            </Select>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    Ticket Name
                                                </th>

                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Pipeline
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Source
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Create Date
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Ass. Contact
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Ass. Company
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Edit</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {tickets.map((ticket, index) => (
                                                <tr key={index} className="hover:bg-gray-100">
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 ">
                                                        {ticket.ticketName}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{ticket.pipeline}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{ticketStatus.find((t) => t.id === ticket.ticketStatus)?.label}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{ticketSource.find((t) => t.id === ticket.source)?.label}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{moment(ticket.createdAt).format("DD MMM. YYYY")}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                                                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/card/${ticket?.deal?.contactId}`}>
                                                            {ticket.deal.contact &&

                                                                <div className="flex gap-2 items-center">
                                                                    <img src={ticket?.deal?.contact?.photoUrl} className="h-6 w-6 rounded-full" />
                                                                    {ticket?.deal?.contact?.firstName + ' ' + ticket?.deal?.contact?.lastName}
                                                                </div>
                                                            }
                                                        </Link>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500 ">
                                                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/companies/card/${ticket?.deal?.companyId}`}>
                                                            {ticket.deal.company &&
                                                                <div className="flex gap-2 items-center">
                                                                    <img src={ticket?.deal?.company?.logoUrl} className="h-6 w-6 rounded-full" />
                                                                    {ticket?.deal?.company?.companyName}
                                                                </div>
                                                            }
                                                        </Link>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                                                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/service/card/${ticket.id}`} className="text-red-600 hover:text-red-900">
                                                            <ArrowRightCircleIcon className="w-6 hover:text-gray-800" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {total > 10 &&
                        <div className="flex items-center justify-between border-t border-gray-200  px-4 py-3 sm:px-0">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <a
                                    href={`/account/${workspaceSlug}/modules/customer-cloud/tickets/${id}?page=${page - 1}`}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Previous
                                </a>
                                <a
                                    href={`/account/${workspaceSlug}/modules/customer-cloud/tickets/${id}?page=${!page ? 2 : + 1}`}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Next
                                </a>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{!page ? "1" : page}</span> to <span className="font-medium">10</span> of{' '}
                                        <span className="font-medium">{total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <a
                                            href={`/account/${workspaceSlug}/modules/customer-cloud/tickets/${id}?page=${page - 1}`}
                                            className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                        </a>

                                        <a
                                            href={`/account/${workspaceSlug}/modules/customer-cloud/tickets/${id}?page=${!page ? 2 : + 1}`}
                                            className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                        </a>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </Content.Container >
        </AccountLayout >
    )
}

export default Contacts




// This is an exported async function that takes in a single argument, context, which is an object containing information about the current request.
export async function getServerSideProps(context) {

    //This destructures the query property of the context object to extract the page and filter variables. 
    //These variables are used to determine the current page number and the filter criteria for the data being retrieved.
    const { page, filter } = context.query;

    //This retrieves the current session using the getSession function and assigns it to the session variable.
    const session = await getSession(context);
    //These two variables are initialized as false and null respectively. 
    //They are used to store whether the current user is a team owner and the current workspace.
    let isTeamOwner = false;
    let workspace = null;

    //This retrieves the module data using the getModule function and assigns it to the modules variable. 
    //It takes the id from the params property of the context object.
    const modules = await getModule(context.params.id);

    //This retrieves the companies data using the getCompanies function and assigns it to the companies variable. 
    //It takes the id from the modules variable.
    const companies = await getCompanies(modules.id)

    //This retrieves the tickets data using the getDealByStage function and assigns it to the tickets variable. 
    //It takes the current page number (or 1 if no page number is provided), the number of tickets per page, the sorting criteria, the filter criteria and the id of the modules.
    const ticket = await getOwnersTickets(session?.user?.userId)

    //This retrieves the contacts data using the getDealContacts function and assigns it to the contacts variable. 
    //It takes the id of the modules.

    const contacts = await getDealContacts(modules.id)

    //If a session exists, it retrieves the workspace data using the getWorkspace function and assigns it to the workspace variable. 
    //Then it checks if the current user is the owner of the workspace using the isWorkspaceOwner function and assigns it to the isTeamOwner variable.

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

    //These props include isTeamOwner, workspace, modules, companies, tickets, total and contacts. 
    //These variables are all stringified before being returned.
    //TODO - add pagination
    const tickets = !filter ? ticket : ticket.filter((ticket) => ticket.ticketStatus === filter)

    return {
        props: {
            isTeamOwner,
            workspace: JSON.stringify(workspace),
            modules: JSON.stringify(modules),
            companies: JSON.stringify(companies),
            tickets: JSON.stringify(tickets),
            contacts: JSON.stringify(contacts),
        }
    }
}