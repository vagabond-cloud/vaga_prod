import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import SlideOver from '@/components/SlideOver';
import { countries } from '@/config/common/countries';
import { dealStage, industries, types } from '@/config/modules/crm';
import { AccountLayout } from '@/layouts/index';
import { log } from '@/lib/client/log';
import api from '@/lib/common/api';
import { getCompanies, getModule, getDeals, getContacts } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}



function Contacts({ modules, companies, workspace, deals, contacts }) {
    modules = JSON.parse(modules)
    companies = JSON.parse(companies)
    workspace = JSON.parse(workspace)
    deals = JSON.parse(deals)
    contacts = JSON.parse(contacts)

    const [filterStage, updateFilterStage] = useState('All')

    const [formInput, updateFormInput] = useState({
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
    })

    const router = useRouter(false);
    const { workspaceSlug, id } = router.query;

    const createContact = async () => {
        const res = await api(`/api/modules/deal`, {
            method: 'PUT',
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

    const writeLog = async () => {
        const res = await log('Deal created', `Deal with the name ${formInput.dealName} created for Module: ${id} `, 'deal_created', '127.0.0.1');
    }

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Deals | Dashboard`} />
            <Content.Title
                title="Deals"
                subtitle="Overview of your deals"
            />
            <Content.Divider />
            <Content.Container>
                <div className="mt-4">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-xl font-semibold text-gray-900">Deals</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                A list of all the deals in your account including their contacts, and companies.
                            </p>
                        </div>
                        <SlideOver
                            title="Add Deal"
                            subTitle="Add a new deal to your account"
                            buttonTitle="Add Deal"
                        >
                            <div className="overflow-scroll h-full pb-20">
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Deal Name
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, dealName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Pipeline
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, pipeline: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Deal Stage
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, dealStage: e.target.value })}
                                        >
                                            {
                                                dealStage.map((stage, index) => (
                                                    <option key={index} value={stage.id}>{stage.name}</option>
                                                )
                                                )}
                                        </Select>
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Amount
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Close Date
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            type="date"
                                            onChange={(e) => updateFormInput({ ...formInput, closeDate: new Date(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Deal Owner
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, dealOwnerId: e.target.value })}
                                        >
                                            {
                                                types.map((stage, index) => (
                                                    <option key={index} value={stage.id}>{stage.name}</option>
                                                )
                                                )}
                                        </Select>
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Deal Type
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, dealType: e.target.value })}
                                        >
                                            <option value="">Choose Type</option>
                                            <option value="New Business">New Business</option>
                                            <option value="Existing Business">Existing Business</option>

                                        </Select>
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Priority
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, priority: e.target.value })}
                                        >
                                            <option value="">Choose Priority</option>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">Heigh</option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="px-6 my-4 border-t">
                                    <p className="text-lg text-gray-500 pt-6">Associate with</p>
                                </div>
                                <div className="px-4 my-6">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Contact
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, contactId: e.target.value })}
                                        >
                                            <option value="" className="text-gray-400">Choose a Contact</option>

                                            {
                                                contacts.map((stage, index) => (
                                                    <option key={index} value={stage.id}>{stage.firstName + ' ' + stage.lastName}</option>
                                                )
                                                )}
                                        </Select>
                                    </div>
                                </div>
                                <div className="px-4 my-6">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Company
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, companyId: e.target.value })}
                                        >
                                            <option value="" className="text-gray-400">Choose a Company</option>

                                            {
                                                companies.map((stage, index) => (
                                                    <option key={index} value={stage.id}>{stage.companyName}</option>
                                                )
                                                )}
                                        </Select>
                                    </div>
                                </div>
                                <div className="px-4 my-6">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Project
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, projectId: e.target.value })}
                                        >
                                            <option value="" className="text-gray-400">Choose a Project</option>

                                            {
                                                types.map((stage, index) => (
                                                    <option key={index} value={stage.id}>{stage.name}</option>
                                                )
                                                )}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-shrink-0 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white">

                                <button
                                    type="submit"
                                    className="ml-4 inline-flex justify-center  rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    onClick={() => createContact()}
                                >
                                    Save
                                </button>
                            </div>
                        </SlideOver>
                    </div>
                    <p className="text-sm w-20 mt-8 text-gray-500">Filter by</p>

                    <div className="grid grid-cols-4 gap-4 mt-2">
                        <Select
                            onChange={(e) => updateFilterStage(e.target.value)}

                        >
                            <option value="All">All Stages</option>
                            {
                                dealStage.map((stage, index) => (
                                    <option key={index} value={stage.id}>{stage.name}</option>

                                ))}
                        </Select>
                    </div>
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    Deal Name
                                                </th>

                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Deal Stage
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Amount
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Close Date
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Deal Owner
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
                                            {deals.filter((stage) => filterStage === "All" ? stage.dealStage : stage.dealStage === filterStage).map((deal, index) => (
                                                <tr key={index} className="hover:bg-gray-100">
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 ">
                                                        {deal.dealName}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{dealStage.find((d) => d.id === deal.dealStage)?.name}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{parseFloat(deal.amount).toLocaleString()}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{moment(deal.closeDate).format("DD MMM. YYYY")}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{deal.dealOwnerId}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                                                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/card/${deal.contactId}`}>
                                                            <div className="flex gap-2 items-center">
                                                                <img src={contacts.find((com) => com.id === deal.contactId)?.photoUrl ? contacts.find((com) => com.id === deal.contactId)?.photoUrl : ""} className="h-6 w-6 rounded-full" />
                                                                {contacts.find((com) => com.id === deal.contactId)?.firstName + ' ' + contacts.find((com) => com.id === deal.contactId)?.lastName}
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500 ">
                                                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/companies/card/${deal.companyId}`}>
                                                            <div className="flex gap-2 items-center">
                                                                <img src={companies.find((com) => com.id === deal.companyId)?.logoUrl ? companies.find((com) => com.id === deal.companyId)?.logoUrl : ""} className="h-6 w-6 rounded-full" />
                                                                {companies.find((com) => com.id === deal.companyId)?.companyName}
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                                                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/deals/card/${deal.id}`} className="text-red-600 hover:text-red-900">
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
                </div>
            </Content.Container >
        </AccountLayout >
    )
}

export default Contacts


export async function getServerSideProps(context) {

    const session = await getSession(context);
    let isTeamOwner = false;
    let workspace = null;

    const modules = await getModule(context.params.id);
    const companies = await getCompanies(modules.id)
    const deals = await getDeals(modules.id)
    const contacts = await getContacts(modules.id)
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

    return {
        props: {
            isTeamOwner,
            workspace: JSON.stringify(workspace),
            modules: JSON.stringify(modules),
            companies: JSON.stringify(companies),
            deals: JSON.stringify(deals),
            contacts: JSON.stringify(contacts),
        }
    }
}