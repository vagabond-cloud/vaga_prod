import Button from '@/components/Button';
import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import Activities from '@/components/modules/customer-cloud/contacts/Activities';
import Calls from '@/components/modules/customer-cloud/contacts/Calls';
import Notes from '@/components/modules/customer-cloud/contacts/Notes';
import Tasks from '@/components/modules/customer-cloud/contacts/Tasks';
import Select from '@/components/Select';
import SlideOver from '@/components/SlideOver';
import { countries } from '@/config/common/countries';
import { leadStages, lifecycleStages } from '@/config/modules/crm';
import { AccountLayout } from '@/layouts/index';
import { contactActivity } from '@/lib/client/log';
import { uploadToGCS } from '@/lib/client/upload';
import api from '@/lib/common/api';
import { getActivity, getCall, getCompanies, getContact, getNote, getTask } from '@/prisma/services/modules';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';
import { PencilIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Contacts({ contact, notes, calls, tasks, activities, companies }) {
    contact = JSON.parse(contact)
    companies = JSON.parse(companies)

    const router = useRouter(false);
    const { workspaceSlug, id, tab } = router.query;

    const [formInput, updateFormInput] = useState({
    })

    const [photo, setPhoto] = useState(null);
    const [banner, setBanner] = useState(null);

    const tabs = [
        { name: 'Overview', href: 'overview', current: tab === 'overview' || !tab ? true : false },
        { name: 'Activity', href: 'activity', current: tab === 'activity' ? true : false },
        { name: 'Notes', href: 'notes', current: tab === 'notes' ? true : false },
        { name: 'Calls', href: 'calls', current: tab === 'calls' ? true : false },
        { name: 'Tasks', href: 'tasks', current: tab === 'tasks' ? true : false },
        { name: 'Projects', href: 'projects', current: tab === 'projects' ? true : false },
    ]

    const photoInput = useRef(null)
    const bannerInput = useRef(null)

    const profile = {
        salutation: contact.salutation,
        name: contact.firstName + ' ' + contact.lastName,
        imageUrl: contact.photoUrl ? contact.photoUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpSzm6trHP-RsKzrcPheEo7wpUO-Zlcle5ffnIZY7HesXZt-IZNAOn4xjD4yDRNeVTawU&usqp=CAU',
        coverImageUrl: contact.bannerUrl ? contact.bannerUrl : 'https://fasttechnologies.com/wp-content/uploads/2017/01/placeholder-banner.png',

        fields: {
            Email: contact.contactEmail,
            Title: contact.jobTitle,
            Lead: contact.leadStatus,
            Stage: contact.lifecycleStage,
            Phone: contact.phone,
            City: contact.city,
            State: contact.state,
            Country: countries.find((c) => c.code === contact.country).name,
            Street: contact.street,
            Zip: contact.zip,
            Website: contact.website,
            Persona: contact.persona,
            Twitter: contact.twitter_handle,
            Language: countries.find((c) => c.language.code === contact.preferred_language).language.name,
            Owner: contact?.user?.name,
            Company: <Link href={`/account/${workspaceSlug}/modules/customer-cloud/companies/card/${contact?.companyId}`}>{companies.find((c) => c.id === contact?.companyId)?.companyName}</Link>,
        },
    }

    const updateContact = async () => {
        const res = await api(`/api/modules/contact`, {
            method: 'POST',
            body: {
                id: contact.id,
                formInput,
                workspaceId: contact.workspaceId,
                moduleid: contact.moduleid,
            }
        })
        if (res.status === 200) {
            await writeLog("Contact Updated", "contact_updated", new Date(), id)
            updateFormInput([])

            router.replace(router.asPath)
            toast.success('Contact updated successfully')
        } else {
            toast.error('Contact update failed')
        }
    }

    const uploadLogo = async (file) => {
        const getPhoto = await uploadToGCS(file)
        updateFormInput({ ...formInput, photoUrl: getPhoto })
        setPhoto(getPhoto)
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
                title={contact.firstName + " " + contact.lastName}
                subtitle={"Last Activity " + moment(contact.lastActivity).format('DD MMM. YYYY')}
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
                    <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                            <div className="flex relative cursor-pointer" >
                                <input type="file" onChange={(e) => uploadLogo(e.target.files[0])} hidden ref={photoInput} />
                                <div className="relative w-full m-auto">
                                    {formInput.photoUrl ?
                                        <div className="w-1/2 h-1/2 absolute top-1/4 left-1/8 p-4"><button className="bg-gray-200 text-gray-800 w-auto h-10 px-8 rounded-md hover:bg-gray-300" onClick={() => updateContact()}>Save</button></div>
                                        :
                                        <div className="w-1/2 h-1/2 absolute top-1/4 left-1/4 p-4"><PencilIcon className="w-8 h-8 text-gray-500" onClick={e => photoInput.current && photoInput.current.click()} /></div>
                                    }
                                    <img
                                        className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                                        src={photo ? photo : profile.imageUrl}
                                        alt=""

                                    />
                                </div>
                            </div>
                            <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                                <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                                    <h1 className="truncate text-2xl font-bold text-gray-900">{profile.name}</h1>

                                </div>
                                <div className="justify-stretch mt-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                                    <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/card/${id}?tab=emails`}>
                                        <Button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        >
                                            <EnvelopeIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            <span>Email</span>
                                        </Button>
                                    </Link>
                                    <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/card/${id}?tab=calls`}>
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
                                                    First Name
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={contact.firstName}
                                                        onChange={(e) => updateFormInput({ ...formInput, firstName: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Last Name
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={contact.lastName}
                                                        onChange={(e) => updateFormInput({ ...formInput, lastName: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Email
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={contact.contactEmail}
                                                        onChange={(e) => updateFormInput({ ...formInput, contactEmail: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Job Title
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={contact.jobTitle}
                                                        onChange={(e) => updateFormInput({ ...formInput, jobTitle: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Phone Number
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={contact.phone}
                                                        onChange={(e) => updateFormInput({ ...formInput, phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Lifecycle Stage
                                                </label>
                                                <div className="mt-1">
                                                    <Select
                                                        defaultValue={contact.lifecycleStage}
                                                        onChange={(e) => updateFormInput({ ...formInput, lifecycleStage: e.target.value })}
                                                    >
                                                        <option value={contact.lifecycleStage}>✅ {contact.lifecycleStage}</option>

                                                        {
                                                            lifecycleStages.map((stage, index) => (
                                                                <option key={index} value={stage.stage}>{stage.stage}</option>
                                                            )
                                                            )}
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Lead Status
                                                </label>
                                                <div className="mt-1">
                                                    <Select
                                                        defaultValue={contact.leadStatus}
                                                        onChange={(e) => updateFormInput({ ...formInput, leadStatus: e.target.value })}
                                                    >
                                                        <option value={contact.leadStatus}>✅ {contact.leadStatus}</option>

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
                                                    City
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={contact.city}
                                                        onChange={(e) => updateFormInput({ ...formInput, city: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Street
                                                </label>
                                                <div className="mt-1">
                                                    <Input
                                                        defaultValue={contact.street}
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
                                                        defaultValue={contact.zip}
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
                                                        defaultValue={contact.state}
                                                        onChange={(e) => updateFormInput({ ...formInput, state: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Country
                                                </label>
                                                <div className="mt-1">
                                                    <Select
                                                        defaultValue={contact.country}
                                                        onChange={(e) => updateFormInput({ ...formInput, country: e.target.value })}
                                                    >
                                                        <option value={contact.country}>{countries.find((c) => c.code === contact.country).name} </option>

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
                                                        defaultValue={contact.website}
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
                                                        defaultValue={contact.persona}
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
                                                        defaultValue={contact.twitter_handle}
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
                                                        defaultValue={contact.country}
                                                        onChange={(e) => updateFormInput({ ...formInput, preferred_language: e.target.value })}
                                                    >
                                                        <option value={contact.country}>{countries.find((c) => c.language.code === contact.preferred_language).language.name} </option>

                                                        {
                                                            countries.map((country, index) => (
                                                                <option key={index} value={country.language.code}>{country.language.name}</option>
                                                            )
                                                            )}
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="px-4 my-6">
                                                <label htmlFor="email" className="block text-xs font-medium text-gray-500">
                                                    Company
                                                </label>
                                                <div className="mt-1">
                                                    <Select
                                                        defaultValue={contact.leadStatus}
                                                        onChange={(e) => updateFormInput({ ...formInput, companyId: e.target.value })}
                                                    >
                                                        <option value={contact.companyId}>✅ {companies.find((c) => c.id === contact.companyId)?.companyName}</option>

                                                        {
                                                            companies.map((company, index) => (
                                                                <option key={index} value={company.id}>{company.companyName}</option>
                                                            )
                                                            )}
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-shrink-0 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white">

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
                        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {tabs.map((tab) => (
                                    <Link
                                        key={tab.name}
                                        href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/card/${id}?tab=${tab.href}`}
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
                {tab === 'notes' &&
                    <Notes profile={profile} notes={notes} />
                }
                {tab === 'calls' &&
                    <Calls profile={profile} calls={calls} />
                }

                {tab === 'tasks' &&
                    <Tasks profile={profile} tasks={tasks} />
                }
                {tab === 'activity' &&
                    <Activities activities={activities} />
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

    const contact = await getContact(context.params.id)
    const notes = await getNote(context.params.id)
    const calls = await getCall(context.params.id)
    const tasks = await getTask(context.params.id)
    const activities = await getActivity(context.params.id)
    const companies = await getCompanies()

    return {
        props: {
            contact: JSON.stringify(contact),
            notes: JSON.stringify(notes),
            calls: JSON.stringify(calls),
            tasks: JSON.stringify(tasks),
            activities: JSON.stringify(activities),
            companies: JSON.stringify(companies)
        }
    }
}

