import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import SlideOver from '@/components/SlideOver';
import { countries } from '@/config/common/countries';
import { leadStages, lifecycleStages, industries, types } from '@/config/modules/crm';
import { AccountLayout } from '@/layouts/index';
import { log } from '@/lib/client/log';
import api from '@/lib/common/api';
import { getCompanies, getModule } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}



function Contacts({ modules, companies, workspace }) {
    modules = JSON.parse(modules)
    companies = JSON.parse(companies)
    workspace = JSON.parse(workspace)


    const [formInput, updateFormInput] = useState({
        companyDomain: '',
        companyName: '',
        industry: '',
        type: '',
        phone: '',
        city: '',
        street: '',
        state: '',
        zip: '',
        country: '',
        employees: '',
        revenue: '',
        timeZone: '',
        description: '',
        linkedin: '',
        website: '',
        logoUrl: '',
        bannerUrl: '',
    })

    const router = useRouter(false);
    const { workspaceSlug, id } = router.query;

    const createContact = async () => {
        const res = await api(`/api/modules/company`, {
            method: 'PUT',
            body: {
                formInput,
                workspaceId: workspace[0].id,
                moduleId: modules.id
            }
        })
        if (res.status === 200) {
            toast.success('Contact created successfully')
            writeLog()
            router.replace(router.asPath)

        } else {
            toast.error('Error creating contact')
        }
    }

    const writeLog = async () => {
        const res = await log('Company created', `Company with the name ${formInput.companyName} created for Module: ${id} `, 'company_created', '127.0.0.1');
    }

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Companies | Dashboard`} />
            <Content.Title
                title="Companies"
                subtitle="Overview of your companies"
            />
            <Content.Divider />
            <Content.Container>
                <div className="mt-4">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-xl font-semibold text-gray-900">Companies</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                A list of all the companies in your account including their name, title, email and role.
                            </p>
                        </div>
                        <SlideOver
                            title="Add Company"
                            subTitle="Add a new company to your account"
                            buttonTitle="Add Company"
                        >
                            <div className="overflow-scroll h-full pb-20">
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Company Domain
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, companyDomain: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Company Name
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, companyName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Industry
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, industry: e.target.value })}
                                        >
                                            {
                                                industries.map((stage, index) => (
                                                    <option key={index} value={stage.id}>{stage.name}</option>
                                                )
                                                )}
                                        </Select>
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Type
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, type: e.target.value })}
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
                                        Phone
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            type="phone"
                                            onChange={(e) => updateFormInput({ ...formInput, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Street
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, street: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, city: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        State
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, state: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Zip
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, zip: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, country: e.target.value })}
                                        >
                                            {
                                                countries.map((stage, index) => (
                                                    <option key={index} value={stage.id}>{stage.name}</option>
                                                )
                                                )}
                                        </Select>
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        # of Employees
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, employees: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Revenue
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, revenue: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            type="textarea"
                                            rows={4}
                                            className="w-full border border-gray-300 rounded-sm shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                            onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        LinkedIn profile URL
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, linkedIn: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Website
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, website: e.target.value })}
                                        />
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
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    Company Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Owner
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Phone Number
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Country
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Last Activity
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Edit</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {companies.map((person, index) => (
                                                <tr key={index} className="hover:bg-gray-100">
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6">
                                                        {person.companyName}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{person.companyOwnerId}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{person.phone}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{person.country}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{moment(person.lastActivity).format("DD MMM. YYYY")}</td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                                                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/companies/card/${person.id}`} className="text-red-600 hover:text-red-900">
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
            companies: JSON.stringify(companies)
        }
    }
}