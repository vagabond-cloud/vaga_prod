import Button from '@/components/Button';
import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import SlideOver from '@/components/SlideOver';
import { countries } from '@/config/common/countries';
import { leadStages, lifecycleStages, outcomes, taskTypes, dueDate, industries, types } from '@/config/modules/crm';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { getCompany, getActivity } from '@/prisma/services/modules';
import { EnvelopeIcon, PhoneIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/solid';
import Modal from '@/components/Modal';
import { contactActivity } from '@/lib/client/log';
import { uploadToGCS } from '@/lib/client/upload';
import { PencilIcon } from '@heroicons/react/24/outline';
import { fileType } from '@/config/common/fileType';
import Documents from '@/components/modules/customer-cloud/companies/Documents';
import CContacts from '@/components/modules/customer-cloud/companies/Contacts';
import Activities from '@/components/modules/customer-cloud/companies/Activities';
import { useForm, Controller } from "react-hook-form";
import Textarea from '@/components/Textarea';
import Projects from '@/components/modules/customer-cloud/companies/Projects';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Contacts({ company, notes, calls, tasks, activities, documents }) {
    company = JSON.parse(company)

    const router = useRouter(false);
    const { workspaceSlug, id, tab } = router.query;

    const [logo, setLogo] = useState(null);
    const [banner, setBanner] = useState(null);

    const logoInput = useRef(null)
    const bannerInput = useRef(null)


    const tabs = [
        { name: 'Overview', href: 'overview', current: tab === 'overview' || !tab ? true : false },
        { name: 'Activity', href: 'activity', current: tab === 'activity' ? true : false },
        { name: 'Contacts', href: 'contacts', current: tab === 'contacts' ? true : false },
        { name: 'Projects', href: 'projects', current: tab === 'projects' ? true : false },
        { name: 'Documents', href: 'documents', current: tab === 'documents' ? true : false },
    ]

    const defaultValues = {
        companyDomain: company.companyDomain,
        companyName: company.companyName,
        industry: company.industry,
        type: company.type,
        phone: company.phone,
        city: company.city,
        street: company.street,
        state: company.state,
        zip: company.zip,
        country: company.country,
        employees: company.employees,
        revenue: company.revenue,
        timeZone: company.timeZone,
        description: company.description,
        timeZone: company.timeZone,
        linkedin: company.linkedin,
        website: company.website,
        logoUrl: company.logoUrl,
        bannerUrl: company.bannerUrl,
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => updateCompany(data);

    const profile = {
        name: company.companyName,
        imageUrl: company.logoUrl ? company.logoUrl : 'https://s3-us-west-2.amazonaws.com/procure-now-public/assets/unknown-business-logo.png',
        coverImageUrl: company.bannerUrl ? company.bannerUrl : 'https://fasttechnologies.com/wp-content/uploads/2017/01/placeholder-banner.png',

        fields: {
            Type: types.find((t) => t.id === company.type)?.name,
            Industry: industries.find((i) => i.id === company.industry)?.name,
            Phone: company.phone,
            Street: company.street,
            City: company.city,
            State: company.state,
            Country: countries.find((c) => c.code === company.country)?.name,
            Zip: company.zip,
            Website: company.website,
            LinkedIn: company.linkedin,
            Employees: company.employees,
            Revenue: parseFloat(company.revenue).toLocaleString(),
            Owner: <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/card/${company?.companyOwnerId}`}>{company?.user?.name}</Link>
        },
    }

    const updateCompany = async (formInput) => {
        const res = await api(`/api/modules/company`, {
            method: 'POST',
            body: {
                id: company.id,
                formInput,
                workspaceId: company.workspaceId,
                moduleid: company.moduleid,
            }
        })
        if (res.status === 200) {
            //TODO - add to api call
            await writeLog("Company Updated", "company_updated", new Date(), id)
            setLogo(null)
            router.replace(router.asPath)
            toast.success('Contact updated successfully')
        } else {
            toast.error('Contact update failed')
        }
    }

    const uploadLogo = async (file) => {
        setLogo(true)
        const getLogo = await uploadToGCS(file)

        const res = await api(`/api/modules/customer-cloud/updateLogo`, {
            method: 'POST',
            body: {
                id: company.id,
                logoUrl: getLogo,
            }
        })
        setLogo(false)

        if (res.status === 200) {
            router.replace(router.asPath)
            toast.success('Logo updated successfully')
        } else {
            toast.error('Logo update failed')
            setLogo(false)
        }
    };

    const uploadBanner = async (file) => {
        setBanner(true)
        const getBanner = await uploadToGCS(file)
        const res = await api(`/api/modules/customer-cloud/updateBanner`, {
            method: 'POST',
            body: {
                id: company.id,
                bannerUrl: getBanner,
            }
        })
        setBanner(false)

        if (res.status === 200) {
            router.replace(router.asPath)
            toast.success('Logo updated successfully')
        } else {
            toast.error('Logo update failed')
            setBanner(false)
        }
    }
    return (
        <AccountLayout>
            <Meta title={`Vagabond - Contacts | Dashboard`} />
            <Content.Title
                title={company.companyName}
                subtitle={"Last Activity " + moment(company.lastActivity).format('DD MMM. YYYY')}
            />
            <Content.Divider />
            <Content.Container>

                {/* Header */}
                <div className="mb-4 -mt-5">
                    <div>
                        <input type="file" onChange={(e) => uploadBanner(e.target.files[0])} hidden ref={bannerInput} />
                        <div className="relative w-full m-auto">
                            {banner ?
                                <div className="w-1/2 h-1/2 absolute top-1/3 left-1/2 p-4">
                                    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                                :
                                <div className="w-1/2 h-1/2 absolute top-1/3 left-1/2 p-4"><PencilIcon className="w-8 h-8 text-gray-500" onClick={e => bannerInput.current && bannerInput.current.click()} /></div>
                            }
                            <img className="h-32 w-full object-cover lg:h-48" src={profile.coverImageUrl} alt="" />
                        </div>
                    </div>
                    <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                            <div className="flex relative cursor-pointer" >
                                <input type="file" onChange={(e) => uploadLogo(e.target.files[0])} hidden ref={logoInput} />
                                <div className="relative w-full m-auto">
                                    {logo ?
                                        <div className="w-1/2 h-1/2 absolute top-1/4 left-1/4 p-4">
                                            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        :
                                        <div className="w-1/2 h-1/2 absolute top-1/4 left-1/4 p-4"><PencilIcon className="w-8 h-8 text-gray-500" onClick={e => logoInput.current && logoInput.current.click()} /></div>
                                    }
                                    <img
                                        className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                                        src={profile.imageUrl}
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                                <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                                    <h1 className="truncate text-2xl font-bold text-gray-900">{profile.name}</h1>
                                </div>
                                <div className="justify-stretch mt-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                                    <Link href={`/account/${workspaceSlug}/modules/customer-cloud/companies/card/${id}?tab=emails`}>
                                        <Button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        >
                                            <EnvelopeIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            <span>Email</span>
                                        </Button>
                                    </Link>
                                    <Link href={`/account/${workspaceSlug}/modules/customer-cloud/companies/card/${id}?tab=calls`}>
                                        <Button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        >
                                            <PhoneIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            <span>Call</span>
                                        </Button>
                                    </Link>
                                    <SlideOver
                                        buttonTitle="Edit"
                                        title="Edit Contact"
                                        subTitle="Make changes to the contact's information"
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
                            </div>
                        </div>
                        <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
                            <h1 className="truncate text-2xl font-bold text-gray-900">{profile.name}</h1>
                        </div>
                    </div>
                </div>
                {/* Tabs */}
                <div className="mt-6 sm:mt-2 2xl:mt-5">
                    <div className="border-b border-gray-200">
                        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {tabs.map((tab) => (
                                    <Link
                                        key={tab.name}
                                        href={`/account/${workspaceSlug}/modules/customer-cloud/companies/card/${id}?tab=${tab.href}`}
                                        className={classNames(
                                            tab.current
                                                ? 'border-red-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
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

                {/* Add Tabs here */}
                {tab === 'overview' &&
                    <Overview profile={profile} />
                }
                {!tab &&
                    <Overview profile={profile} />
                }

                {tab === 'activity' &&
                    <Activities activities={activities} />
                }
                {tab === 'contacts' &&
                    <CContacts company={company} />
                }
                {tab === 'projects' &&
                    <Projects deal={company} />
                }
                {tab === 'documents' &&
                    <Documents company={company} documents={documents} />
                }
                {/* Tabs End */}

            </Content.Container>
        </AccountLayout >
    )
}

export default Contacts

const Overview = ({ profile }) => {

    return (
        <div className="mx-auto mt-6 w-full px-4 sm:px-6 lg:px-14">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 pt-4">
                {Object.keys(profile.fields).map((field) => (
                    <div key={field} className="sm:col-span-1">
                        <dt className="text-xs font-medium text-gray-500">{field}</dt>
                        <dd className={`${field === "Lead" && "inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-sm text-gray-800"} ${field === "Stage" && "inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-sm text-gray-800"} mt-2 text-sm`}>{profile.fields[field]}</dd>
                    </div>
                ))}

            </dl>
        </div>
    )
}

const writeLog = async (type, action, date, contactId) => {
    const res = await contactActivity(`${type}`, `${type} at ${date}`, `${action.toLowerCase()}`, '127.0.0.1', contactId);
}

export async function getServerSideProps(context) {

    const company = await getCompany(context.params.id)
    const notes = company.note
    const calls = company.call
    const tasks = company.task
    const activities = await getActivity(context.params.id)
    const documents = company.document
    return {
        props: {
            company: JSON.stringify(company),
            notes: JSON.stringify(notes),
            calls: JSON.stringify(calls),
            tasks: JSON.stringify(tasks),
            activities: JSON.stringify(activities),
            documents: JSON.stringify(documents)
        }
    }
}

