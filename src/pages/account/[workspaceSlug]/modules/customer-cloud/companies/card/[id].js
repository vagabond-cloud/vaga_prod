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
import { getCompany, getNote, getCall, getTask, getActivity, getDocuments } from '@/prisma/services/modules';
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

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Contacts({ company, notes, calls, tasks, activities, documents }) {
    company = JSON.parse(company)

    const router = useRouter(false);
    const { workspaceSlug, id, tab } = router.query;

    const [logo, setLogo] = useState(null);
    const [banner, setBanner] = useState(null);

    const [formInput, updateFormInput] = useState({
        firstName: '',
        lastName: '',
        contactEmail: '',
        jobTitle: '',
        phone: '',
        logoUrl: '',
    })

    const tabs = [
        { name: 'Overview', href: 'overview', current: tab === 'overview' || !tab ? true : false },
        { name: 'Activity', href: 'activity', current: tab === 'activity' ? true : false },
        { name: 'Contacts', href: 'contacts', current: tab === 'contacts' ? true : false },
        { name: 'Projects', href: 'tasks', current: tab === 'tasks' ? true : false },
        { name: 'Documents', href: 'documents', current: tab === 'documents' ? true : false },
    ]

    const logoInput = useRef(null)
    const bannerInput = useRef(null)



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

    const updateContact = async () => {
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
            updateFormInput([])
            router.replace(router.asPath)
            toast.success('Contact updated successfully')
        } else {
            toast.error('Contact update failed')
        }
    }


    const uploadLogo = async (file) => {

        const getLogo = await uploadToGCS(file)
        updateFormInput({ ...formInput, logoUrl: getLogo })
        setLogo(getLogo)
    };

    const uploadBanner = async (file) => {

        const getBanner = await uploadToGCS(file)
        updateFormInput({ ...formInput, bannerUrl: getBanner })
        setBanner(getBanner)
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
                            {formInput.bannerUrl ?
                                <div className="w-1/2 h-1/2 absolute top-1/3 left-1/2 px-auto py-auto"><button className="bg-gray-200 text-gray-800 w-auto h-10 px-8 rounded-md hover:bg-gray-300" onClick={() => updateContact()}>Save</button></div>
                                :
                                <div className="w-1/2 h-1/2 absolute top-1/3 left-1/2 p-4"><PencilIcon className="w-8 h-8 text-gray-500" onClick={e => bannerInput.current && bannerInput.current.click()} /></div>
                            }
                            <img className="h-32 w-full object-cover lg:h-48" src={banner ? banner : profile.coverImageUrl} alt="" />
                        </div>
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                            <div className="flex relative cursor-pointer" >
                                <input type="file" onChange={(e) => uploadLogo(e.target.files[0])} hidden ref={logoInput} />
                                <div className="relative w-full m-auto">
                                    {formInput.logoUrl ?
                                        <div className="w-1/2 h-1/2 absolute top-1/4 left-1/8 p-4"><button className="bg-gray-200 text-gray-800 w-auto h-10 px-8 rounded-md hover:bg-gray-300" onClick={() => updateContact()}>Save</button></div>
                                        :
                                        <div className="w-1/2 h-1/2 absolute top-1/4 left-1/4 p-4"><PencilIcon className="w-8 h-8 text-gray-500" onClick={e => logoInput.current && logoInput.current.click()} /></div>
                                    }
                                    <img
                                        className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                                        src={logo ? logo : profile.imageUrl}
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
                                        <div className="overflow-scroll h-full pb-20">
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Company Domain
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={company.companyDomain}
                                                        onChange={(e) => updateFormInput({ ...formInput, companyDomain: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Company Name
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={company.companyName}
                                                        onChange={(e) => updateFormInput({ ...formInput, companyName: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Industry
                                                </label>
                                                <div className="mt-1">
                                                    <Select
                                                        defaultValue={company.industry}
                                                        onChange={(e) => updateFormInput({ ...formInput, lifecycleStage: e.target.value })}
                                                    >
                                                        <option value={company.industry}>✅ {industries.find((i) => i.id === company.industry)?.name}</option>

                                                        {
                                                            industries.map((stage, index) => (
                                                                <option key={index} value={stage.id}>{stage.name}</option>
                                                            )
                                                            )}
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Type
                                                </label>
                                                <div className="mt-1">
                                                    <Select
                                                        defaultValue={company.industry}
                                                        onChange={(e) => updateFormInput({ ...formInput, lifecycleStage: e.target.value })}
                                                    >
                                                        <option value={company.type}>✅ {types.find((i) => i.id === company.type)?.name}</option>

                                                        {
                                                            types.map((stage, index) => (
                                                                <option key={index} value={stage.id}>{stage.name}</option>
                                                            )
                                                            )}
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Phone
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        type="phone"
                                                        defaultValue={company.phone}
                                                        onChange={(e) => updateFormInput({ ...formInput, phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Street
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={company.street}
                                                        onChange={(e) => updateFormInput({ ...formInput, street: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Zip
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={company.zip}
                                                        onChange={(e) => updateFormInput({ ...formInput, zip: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    City
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={company.city}
                                                        onChange={(e) => updateFormInput({ ...formInput, city: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    State
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={company.state}
                                                        onChange={(e) => updateFormInput({ ...formInput, state: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Country
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={company.country}
                                                        onChange={(e) => updateFormInput({ ...formInput, country: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Website
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={company.website}
                                                        onChange={(e) => updateFormInput({ ...formInput, website: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    LinkedIn
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={company.linkedin}
                                                        onChange={(e) => updateFormInput({ ...formInput, linkedin: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Employees
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={company.state}
                                                        onChange={(e) => updateFormInput({ ...formInput, employees: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Revenue
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={parseFloat(company.revenue).toLocaleString()}
                                                        onChange={(e) => updateFormInput({ ...formInput, revenue: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-shrink-0 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white resize-y">

                                            <Button
                                                type="submit"
                                                className="ml-4 inline-flex text-white justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white5shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                onClick={() => updateContact()}
                                            >
                                                Save
                                            </Button>
                                        </div>
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
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
    const notes = await getNote(context.params.id)
    const calls = await getCall(context.params.id)
    const tasks = await getTask(context.params.id)
    const activities = await getActivity(context.params.id)
    const documents = await getDocuments(context.params.id)
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

