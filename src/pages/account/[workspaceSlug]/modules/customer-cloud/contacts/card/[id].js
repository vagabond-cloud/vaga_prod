import Button from '@/components/Button';
import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import SlideOver from '@/components/SlideOver';
import { countries } from '@/config/common/countries';
import { leadStages, lifecycleStages, outcomes, taskTypes, dueDate } from '@/config/modules/crm';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { getContact, getNote, getCall, getTask, getActivity, getCompanies } from '@/prisma/services/modules';
import { EnvelopeIcon, PhoneIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/solid';
import Modal from '@/components/Modal';
import { contactActivity } from '@/lib/client/log';
import { PencilIcon } from '@heroicons/react/24/outline';
import { uploadToGCS } from '@/lib/client/upload';

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

    console.log(formInput)

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
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

const Activities = ({ activities }) => {
    activities = JSON.parse(activities)

    return (
        <div className="w-full px-4 mt-10">
            {activities.sort((a, b) => { new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() }).reverse().map((item, index) => (
                <div key={index} className="cursor-pointer pointer-events-auto w-full max-w-7xl overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100">
                    <div className="p-4">
                        <div className="flex items-between">
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-400 truncate pr-8 my-2">{item.description}</p>
                                <p className="text-xs text-gray-400 truncate pr-8 my-2">{moment(item.createdAt).format("DD MMM. YYYY - hh:mm:ss")}</p>

                            </div>

                            <div className="ml-4 flex flex-shrink-0">
                                <div className="block w-full">
                                    <button
                                        type="button"
                                        className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        <span className="sr-only">Close</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const writeLog = async (type, action, date, contactId) => {
    const res = await contactActivity(`${type}`, `${type} at ${date}`, `${action.toLowerCase()}`, '127.0.0.1', contactId);
}

const Notes = ({ profile, notes }) => {
    notes = JSON.parse(notes)

    const router = useRouter()
    const { id } = router.query

    const [title, setTitle] = useState("")
    const [note, setNote] = useState("")
    const [showOverlay, setShowOverlay] = useState(false)
    const [modalContent, setModalContent] = useState({})

    const addNote = async () => {
        if (!title || !note) return toast.error("Please fill all the fields")
        const res = await api(`/api/modules/note`, {
            method: "PUT",
            body: {
                contactId: id,
                note,
                title,
            }
        })
        await writeLog("Note Created", "note_created", new Date(), id)
        router.replace(router.asPath)
        toast.success("Note added successfully")
    }

    const deleteNote = async (cid) => {
        const res = await api(`/api/modules/note?contactId=${cid}`, {
            method: "DELETE"
        })
        setShowOverlay(!showOverlay)
        await writeLog("Note Deleted", "note_deleted", new Date(), id)

        router.replace(router.asPath)
        toast.success("Note deleted successfully")
    }

    const toggleModal = (item) => {

        setModalContent(item)
        setShowOverlay(!showOverlay)
    }



    return (
        <div className="px-6">
            <div className="flex justify-between gap-4 items-center">
                <div className="w-full px-4">
                    <p className="text-lg text-gray-800">Notes</p>
                </div>
                <SlideOver
                    title="Add Note"
                    buttonTitle={<PlusIcon className="w-5 h-5 text-white" />}
                >
                    <div className="px-4 my-6">
                        <div className="mb-4">
                            <Input
                                placeholder="Title"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <textarea
                            type="textarea"
                            placeholder="Add Note"
                            className="w-full border border-gray-300 rounded-sm shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            rows={18}
                            onChange={(e) => setNote(e.target.value)}
                        />

                    </div>
                    <div className="px-4 my-6">
                        <p className="text-md font-medium text-gray-500">{profile.name}</p>
                        <p className="text-sm my-1 text-gray-500">{profile.fields.Lead}</p>
                        <p className="text-sm my-1 text-gray-500">{profile.fields.Stage}</p>
                        <p className="text-sm my-2 text-gray-500">{moment().format("DD MMM. YYYY - hh:mm:ss")}</p>
                    </div>

                    <div className="flex flex-shrink-0 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white">

                        <Button
                            type="submit"
                            className="ml-4 inline-flex text-white justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white5shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            onClick={() => addNote()}
                        >
                            Save
                        </Button>
                    </div>
                </SlideOver>
            </div>
            <div className="w-full px-4 mt-10">
                {notes.sort((a, b) => { new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() }).reverse().map((item, index) => (
                    <div key={index} className="cursor-pointer pointer-events-auto w-full max-w-7xl overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100" onClick={() => toggleModal(item)}>
                        <div className="p-4">
                            <div className="flex items-between">
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{item.note}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{moment(item.createdAt).format("DD MMM. YYYY - hh:mm:ss")}</p>

                                </div>
                                <div className="flex pt-0.5 items-center justify-end">
                                    <ChevronRightIcon className="h-5 w-5 text-gray-800" />
                                </div>
                                <div className="ml-4 flex flex-shrink-0">
                                    <div className="block w-full">
                                        <button
                                            type="button"
                                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        >
                                            <span className="sr-only">Close</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal show={showOverlay} title={modalContent.title} toggle={toggleModal}>
                <div className="my-8 w-96">
                    <p className="text-sm text-gray-500">
                        {modalContent.note}
                    </p>
                </div>
                <div className="border-t py-2">
                    <div className="flex gap-4">
                        <p className="text-xs text-gray-500">{modalContent?.user?.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-xs text-gray-500">{moment(modalContent.createdBy).format("DD MMM. YYYY - hh:mm:ss")}</p>
                    </div>
                </div>
                <div className="flex w-full justify-end gap-4">
                    <Button
                        type="submit"
                        className="bg-gray-600 hover:bg-gray-700 focus:ring-red-500 text-white"
                        onClick={() => deleteNote(modalContent.id)}
                    >
                        Delete
                    </Button>
                    <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
                        onClick={() => setShowOverlay(!showOverlay)}
                    >
                        Close
                    </Button>
                </div>
            </Modal >
        </div>
    )
}

const Calls = ({ profile, calls }) => {
    calls = JSON.parse(calls)

    const router = useRouter()
    const { id } = router.query

    const [note, setNote] = useState("")
    const [outcome, setOutcome] = useState("")
    const [direction, setDirection] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [showOverlay, setShowOverlay] = useState(false)
    const [modalContent, setModalContent] = useState({})

    const addCall = async () => {
        if (!outcome || !note || !direction || !date) return toast.error("Please fill all the fields")
        const res = await api(`/api/modules/call`, {
            method: "PUT",
            body: {
                contactId: id,
                note,
                outcome,
                direction,
                date: new Date(date),
                time: new Date(time)
            }
        })
        await writeLog("Call Created", "call_created", new Date(), id)
        router.replace(router.asPath)
        toast.success("Call added successfully")
    }

    const deleteCall = async (cid) => {
        const res = await api(`/api/modules/call?contactId=${cid}`, {
            method: "DELETE"
        })
        setShowOverlay(!showOverlay)
        await writeLog("Call Deleted", "call_deleted", new Date(), id)
        router.replace(router.asPath)
        toast.success("Call deleted successfully")
    }

    const toggleModal = (item) => {

        setModalContent(item)
        setShowOverlay(!showOverlay)
    }

    return (
        <div className="px-6">
            <div className="flex justify-between gap-4 items-center">
                <div className="w-full px-4">
                    <p className="text-lg text-gray-800">Calls</p>
                </div>
                <SlideOver
                    title="Add Call"
                    buttonTitle={<PlusIcon className="w-5 h-5 text-white" />}
                >
                    <div className="px-4 my-6">
                        <div className="mb-4 flex gap-4">
                            <p className="text-sm font-medium text-gray-500">Contacted</p>
                            <p className="text-sm font-medium text-gray-500"> {profile.fields.Email}</p>
                        </div>

                        <div className="mb-4">
                            <Select

                                onChange={(e) => setOutcome(e.target.value)}
                            >
                                {
                                    outcomes.map((stage, index) => (
                                        <option key={index} value={stage.stage}>{stage.stage}</option>
                                    )
                                    )}
                            </Select>
                        </div>
                        <div className="mb-4">
                            <Select

                                onChange={(e) => setDirection(e.target.value)}
                            >
                                <option value="inbound">Inbound</option>
                                <option value="outbound">Outbound</option>

                            </Select>
                        </div>
                        <div className="mb-4">
                            <Input type="date" placeholder="Date" onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <Input type="time" placeholder="Date" onChange={(e) => setTime(e.target.value)} />
                        </div>
                        <textarea
                            type="textarea"
                            placeholder="Add Note"
                            className="w-full border border-gray-300 rounded-sm shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            rows={18}
                            onChange={(e) => setNote(e.target.value)}
                        />

                    </div>


                    <div className="flex flex-shrink-0 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white">

                        <Button
                            type="submit"
                            className="ml-4 inline-flex text-white justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white5shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            onClick={() => addCall()}
                        >
                            Save
                        </Button>
                    </div>
                </SlideOver>
            </div>
            <div className="w-full px-4 mt-10">
                {calls.sort((a, b) => { new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() }).reverse().map((item, index) => (
                    <div key={index} className="cursor-pointer pointer-events-auto w-full max-w-7xl overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100" onClick={() => toggleModal(item)}>
                        <div className="p-4">
                            <div className="flex items-between">
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">{item.outcome}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{item.direction.toUpperCase()}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{moment(item.createdAt).format("DD MMM. YYYY - hh:mm:ss")}</p>

                                </div>
                                <div className="flex pt-0.5 items-center justify-end">
                                    <ChevronRightIcon className="h-5 w-5 text-gray-800" />
                                </div>
                                <div className="ml-4 flex flex-shrink-0">
                                    <div className="block w-full">
                                        <button
                                            type="button"
                                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        >
                                            <span className="sr-only">Close</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal show={showOverlay} title={modalContent.email} toggle={toggleModal}>
                <div className="my-8 w-96">
                    <div className='flex items-center justify-between'>
                        <p className="text-sm text-gray-500 mb-4">
                            {modalContent.outcome}
                        </p>
                        <p className={`${modalContent.direction === "inbound" ? "inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800" : "inline-flex items-center rounded-md bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800"}text-sm text-gray-600 mb-4`}>
                            {modalContent.direction === "inbound" ? "Inbound" : "Outbound"}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">
                        {modalContent.note}
                    </p>
                </div>
                <div className="border-t py-2">
                    <div className="flex gap-4">
                        <p className="text-xs text-gray-500">{modalContent?.user?.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-xs text-gray-500">{moment(modalContent.createdBy).format("DD MMM. YYYY - hh:mm:ss")}</p>
                    </div>
                </div>
                <div className="flex w-full justify-end gap-4">
                    <Button
                        type="submit"
                        className="bg-gray-600 hover:bg-gray-700 focus:ring-red-500 text-white"
                        onClick={() => deleteCall(modalContent.id)}
                    >
                        Delete
                    </Button>
                    <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
                        onClick={() => setShowOverlay(!showOverlay)}
                    >
                        Close
                    </Button>
                </div>
            </Modal >
        </div>
    )
}

const Tasks = ({ profile, tasks }) => {
    tasks = JSON.parse(tasks)

    const router = useRouter()
    const { id } = router.query

    const [note, setNote] = useState("")
    const [title, setTitle] = useState("")
    const [reminder, setReminder] = useState("")
    const [date, setDate] = useState("")
    const [type, setType] = useState("")
    const [priority, setPriority] = useState("")
    const [queue, setQueue] = useState("")
    const [assigned, setAssigned] = useState("")
    const [showOverlay, setShowOverlay] = useState(false)
    const [modalContent, setModalContent] = useState({})

    const addTask = async () => {
        if (!title || !note || !type || !priority) return toast.error("Please fill all the fields")
        const res = await api(`/api/modules/task`, {
            method: "PUT",
            body: {
                contactId: id,
                note,
                title,
                reminder,
                type,
                priority,
                queue,
                assigned,
                date: new Date(date),
            }
        })
        await writeLog("Task Created", "task_created", new Date(), id)

        router.replace(router.asPath)
        toast.success("Task added successfully")
    }

    const deleteTask = async (cid) => {
        const res = await api(`/api/modules/task?contactId=${cid}`, {
            method: "DELETE"
        })
        setShowOverlay(!showOverlay)
        await writeLog("Task Created", "task_created", new Date(), id)

        router.replace(router.asPath)
        toast.success("Task deleted successfully")
    }

    const toggleModal = (item) => {

        setModalContent(item)
        setShowOverlay(!showOverlay)
    }

    return (
        <div className="px-6">
            <div className="flex justify-between gap-4 items-center">
                <div className="w-full px-4">
                    <p className="text-lg text-gray-800">Tasks</p>
                </div>
                <SlideOver
                    title="Add Call"
                    buttonTitle={<PlusIcon className="w-5 h-5 text-white" />}
                >
                    <div className="px-4 my-6">
                        <div className="mb-4">
                            <Input type="text" placeholder="Enter your task" onChange={(e) => setTitle(e.target.value)} />
                        </div>

                        <div className="mb-4">
                            <Select
                                onChange={(e) => setDate(e.target.value)}
                            >
                                <option>Due Date</option>

                                {
                                    dueDate.map((stage, index) => (
                                        <option key={index} value={stage.id}>{stage.name}</option>
                                    )
                                    )}
                            </Select>
                        </div>
                        <div className="mb-4">
                            <Select
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option>Type</option>

                                {
                                    taskTypes.map((stage, index) => (
                                        <option key={index} value={stage.id}>{stage.name}</option>
                                    )
                                    )}
                            </Select>
                        </div>
                        <div className="mb-4">
                            <Select
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option>Priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>

                            </Select>
                        </div>
                        <textarea
                            type="textarea"
                            placeholder="Add Note"
                            className="w-full border border-gray-300 rounded-sm shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            rows={18}
                            onChange={(e) => setNote(e.target.value)}
                        />

                    </div>


                    <div className="flex flex-shrink-0 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white">

                        <Button
                            type="submit"
                            className="ml-4 inline-flex text-white justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white5shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            onClick={() => addTask()}
                        >
                            Save
                        </Button>
                    </div>
                </SlideOver>
            </div>
            <div className="w-full px-4 mt-10">
                {tasks.sort((a, b) => { new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() }).reverse().map((item, index) => (
                    <div key={index} className="cursor-pointer pointer-events-auto w-full max-w-7xl overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100" onClick={() => toggleModal(item)}>
                        <div className="p-4">
                            <div className="flex items-between">
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{taskTypes.find((t) => t.id === item.type).name}</p>
                                    <p className="text-xs text-gray-400 truncate pr-8 my-2">{moment(item.createdAt).format("DD MMM. YYYY - hh:mm:ss")}</p>

                                </div>
                                <div className="flex pt-0.5 items-center justify-end">
                                    <ChevronRightIcon className="h-5 w-5 text-gray-800" />
                                </div>
                                <div className="ml-4 flex flex-shrink-0">
                                    <div className="block w-full">
                                        <button
                                            type="button"
                                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        >
                                            <span className="sr-only">Close</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal show={showOverlay} title={modalContent.title} toggle={toggleModal}>
                <div className="my-8 w-96">
                    <div className='flex justify-between'>
                        <p className="text-sm text-gray-500 mb-4">
                            {taskTypes.find((t) => t.id === modalContent.type)?.name}
                        </p>
                        <p className={`inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800`}>
                            {modalContent.priority?.toUpperCase()}

                        </p>
                    </div>
                    <p className="text-sm text-gray-500">
                        {modalContent.note}
                    </p>
                </div>
                <div className="border-t py-2">
                    <div className="flex gap-4">
                        <p className="text-xs text-gray-500">{modalContent?.user?.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-xs text-gray-500">{moment(modalContent.createdBy).format("DD MMM. YYYY - hh:mm:ss")}</p>
                    </div>
                </div>
                <div className="flex w-full justify-end gap-4">
                    <Button
                        type="submit"
                        className="bg-gray-600 hover:bg-gray-700 focus:ring-red-500 text-white"
                        onClick={() => deleteTask(modalContent.id)}
                    >
                        Delete
                    </Button>
                    <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
                        onClick={() => setShowOverlay(!showOverlay)}
                    >
                        Close
                    </Button>
                </div>
            </Modal >
        </div>
    )
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

