import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import SlideOver from '@/components/SlideOver';
import { countries } from '@/config/common/countries';
import { leadStages, lifecycleStages } from '@/config/modules/crm';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { getContacts, getModule } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

function Contacts({ modules, contacts, workspace, total }) {
    modules = JSON.parse(modules)
    contacts = JSON.parse(contacts)
    workspace = JSON.parse(workspace)

    const [formInput, updateFormInput] = useState({
        firstName: '',
        lastName: '',
        contactEmail: '',
        jobTitle: '',
        phone: '',
        country: '',
        city: '',
        state: '',
        zip: '',
        address: '',
        website: '',
        company: '',
        leadStatus: '',
        lifecycleStage: '',
    })
    console.log(formInput)
    const router = useRouter(false);
    const { workspaceSlug, id, page } = router.query;

    const createContact = async () => {

        //Check if all fields of formInpput are filled
        if (formInput.firstName === '' || formInput.lastName === '' || formInput.contactEmail === '', formInput.city === '' || formInput.leadStatus === '' || formInput.lifecycleStage === '') {
            toast.error('Please fill in all fields')
            return
        }


        try {
            // Make a PUT request to the /api/modules/contact endpoint, passing in the formInput, the ID of the first workspace in the workspace array, and the ID of the module
            const res = await api(`/api/modules/contact`, {
                method: 'PUT',
                body: {
                    formInput,
                    workspaceId: workspace[0].id,
                    moduleId: modules.id
                }
            })
            // Check the status of the response
            if (res.status === 200) {
                // If the status is 200, show a success message and call the writeLog function
                writeLog()
                // Refresh the current page
                router.replace(router.asPath)
            } else {
                // If the status is not 200, show an error message
                toast.error('Error creating contact')
            }
        } catch (err) {
            const message = error.response ? error.response.data.message : error.message;
            toast.error(`Error creating contact: ${message}`);
        }
    }


    const writeLog = async () => {
        toast.success('Contact created successfully')
    }

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Contacts | Dashboard`} />
            <Content.Title
                title="Contacts"
                subtitle="Overview of your contacts"
            />
            <Content.Divider />
            <Content.Container>
                <div className="mt-4">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-xl font-semibold text-gray-900">Contacts</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                A list of all the contacts in your account including their name, title, email and role.
                            </p>
                        </div>
                        <SlideOver
                            title="Add Contact"
                            subTitle="Add a new contact to your account"
                            buttonTitle="Add Contact"
                        >
                            <div className="overflow-scroll h-full pb-20">
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        First Name  <span className="text-xs text-gray-500">(Required)</span>
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, firstName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Last Name  <span className="text-xs text-gray-500">(Required)</span>
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email  <span className="text-xs text-gray-500">(Required)</span>
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, contactEmail: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Job Title
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, jobTitle: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Lifecycle Stage  <span className="text-xs text-gray-500">(Required)</span>
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, lifecycleStage: e.target.value })}
                                        >
                                            {
                                                lifecycleStages.map((stage, index) => (
                                                    <option key={index} value={stage.stage}>{stage.stage}</option>
                                                )
                                                )}
                                        </Select>
                                    </div>
                                </div>
                                <div className="px-4 my-10">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Lead Status <span className="text-xs text-gray-500">(Required)</span>
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, leadStatus: e.target.value })}
                                        >
                                            {
                                                leadStages.map((stage, index) => (
                                                    <option key={index} value={stage.stage}>{stage.stage}</option>
                                                )
                                                )}
                                        </Select>
                                    </div>
                                </div>
                                <div className="px-4 my-6">
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                        City  <span className="text-xs text-gray-500">(Required)</span>
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, city: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-6">
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                        Street  <span className="text-xs text-gray-500">(Required)</span>
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, street: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-6">
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                        Zip  <span className="text-xs text-gray-500">(Required)</span>
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, zip: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-6">
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                        State
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, state: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-6">
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                        Country  <span className="text-xs text-gray-500">(Required)</span>
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, country: e.target.value })}
                                        >

                                            {
                                                countries.map((country, index) => (
                                                    <option key={index} value={country.code}>{country.name}</option>
                                                )
                                                )}
                                        </Select>
                                    </div>
                                </div>
                                <div className="px-4 my-6">
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                        Website
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, website: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-6">
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                        Persona
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, persona: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-6">
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                        Twitter Username
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            onChange={(e) => updateFormInput({ ...formInput, twitter_handle: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="px-4 my-6">
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                        Preferred Language
                                    </label>
                                    <div className="mt-1">
                                        <Select
                                            onChange={(e) => updateFormInput({ ...formInput, preferred_language: e.target.value })}
                                        >

                                            {
                                                countries.map((country, index) => (
                                                    <option key={index} value={country.language.code}>{country.language.name}</option>
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
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Email
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Phone Number
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Contact Owner
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
                                            {contacts.map((person, index) => (
                                                <tr key={index} className="hover:bg-gray-100">
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6">
                                                        {person.firstName + ' ' + person.lastName}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{person.contactEmail}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{person.phone}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{person.contactOwnerId}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{moment(person.lastActivity).format("DD MMM. YYYY")}</td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                                                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/card/${person.id}`} className="text-red-600 hover:text-red-900">
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
                    {total > 1 &&
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-0">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <a
                                    href="#"
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Previous
                                </a>
                                <a
                                    href="#"
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
                                            href="#"
                                            className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                        </a>

                                        <a
                                            href="#"
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
            </Content.Container>
        </AccountLayout >
    )
}

export default Contacts


export async function getServerSideProps(context) {

    const { page } = context.query
    const session = await getSession(context);
    let isTeamOwner = false;
    let workspace = null;

    const modules = await getModule(context.params.id);
    const contacts = await getContacts(!page ? 1 : page, 10, { id: 'asc' }, modules.id)

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
    console.log(contacts.total)
    return {
        props: {
            isTeamOwner,
            workspace: JSON.stringify(workspace),
            modules: JSON.stringify(modules),
            contacts: JSON.stringify(contacts?.contacts),
            total: contacts.total
        }
    }
}