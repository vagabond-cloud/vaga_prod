import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import SlideOver from '@/components/SlideOver';
import { countries } from '@/config/common/countries';
import { leadStages, lifecycleStages, industries, types } from '@/config/modules/crm';
import { AccountLayout } from '@/layouts/index';
import { log } from '@/lib/client/log';
import api from '@/lib/common/api';
import { getAllCompanies, getModule } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link'
import { useForm, Controller } from "react-hook-form";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Company({ modules, companies, workspace }) {
    modules = JSON.parse(modules)
    companies = JSON.parse(companies)
    workspace = JSON.parse(workspace)

    const router = useRouter(false);
    const { workspaceSlug, id } = router.query;

    const defaultValues = {
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
        timeZone: '',
        logoUrl: '',
        bannerUrl: '',
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => createCompany(data);

    const createCompany = async (formInput) => {

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
        const res = await log('Company created', `Company with the name ${defaultValues.companyName} created for Module: ${id} `, 'company_created', '127.0.0.1');
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
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="overflow-scroll h-full pb-20">
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="companyDomain"
                                                id="companyDomain"
                                                control={control}
                                                rules={{
                                                    required: true,
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9]+([a-zA-Z0-9-]*[a-zA-Z0-9])*(\.[a-zA-Z0-9]+([a-zA-Z0-9-]*[a-zA-Z0-9])*)+$/,
                                                        message: "Invalid domain"
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Company Domain *"
                                                        placeholder="domain.com"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">
                                                {errors.companyDomain?.type === 'required' && <p role="alert">Company Domain is required</p>}
                                                {errors.companyDomain && <p role="alert">{errors.companyDomain?.message}</p>}

                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="companyName"
                                                id="companyName"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Company Name *"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.companyName?.type === 'required' && <p role="alert">Company Name is required</p>}</div>
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="industry"
                                                id="industry"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        label="Industry"
                                                        {...field}
                                                    >
                                                        {
                                                            industries.map((stage, index) => (
                                                                <option key={index} value={stage.id}>{stage.name}</option>
                                                            ))}
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="type"
                                                id="type"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        label="Type"
                                                        {...field}
                                                    >
                                                        {
                                                            types.map((stage, index) => (
                                                                <option key={index} value={stage.id}>{stage.name}</option>
                                                            ))}
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="phone"
                                                id="phone"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Phone"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="street"
                                                id="street"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Street"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="city"
                                                id="city"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="City"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="state"
                                                id="state"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="State"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="zip"
                                                id="zip"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Zip"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="country"
                                                id="country"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        label="Country"
                                                        {...field}
                                                    >
                                                        {
                                                            countries.map((stage, index) => (
                                                                <option key={index} value={stage.code}>{stage.name}</option>
                                                            ))}
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="employees"
                                                id="employees"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="# of Employees"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="revenue"
                                                id="revenue"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Revenue"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="description"
                                                id="description"
                                                control={control}
                                                render={({ field }) => (
                                                    <Textarea
                                                        label="Description"
                                                        rows={4}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="linkedin"
                                                id="linkedin"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="LinkedIn"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="website"
                                                id="website"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Website"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="flex flex-shrink-0 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white">
                                    <button
                                        type="submit"
                                        className="ml-4 inline-flex justify-center  rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
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
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 flex gap-2 items-center">
                                                        <img src={person.logoUrl ? person.logoUrl : "https://s3-us-west-2.amazonaws.com/procure-now-public/assets/unknown-business-logo.png"} className="w-8 h-8 rounded-full" alt="" />
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

export default Company


export async function getServerSideProps(context) {
    const { page } = context.query

    const session = await getSession(context);
    let isTeamOwner = false;
    let workspace = null;

    const modules = await getModule(context.params.id);
    const companies = await getAllCompanies(!page ? 1 : page, 10, { id: 'asc' }, modules.id)

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
            companies: JSON.stringify(companies?.companies)
        }
    }
}