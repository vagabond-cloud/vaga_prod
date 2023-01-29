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
import { useRef, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useForm, Controller } from "react-hook-form";
import { GoogleMap, MarkerF, useJsApiLoader, InfoBox } from '@react-google-maps/api';
import { mapStyles, containerStyle } from '@/config/common/mapStyles';
import { getMap } from '@/lib/server/map'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Contacts({ contact, notes, calls, tasks, activities, companies, lat, lng }) {
    contact = JSON.parse(contact)
    companies = JSON.parse(companies)

    const router = useRouter(false);
    const { workspaceSlug, id, tab } = router.query;

    const defaultValues = {
        salutation: contact.salutation,
        firstName: contact.firstName,
        lastName: contact.lastName,
        contactEmail: contact.contactEmail,
        jobTitle: contact.jobTitle,
        phone: contact.phone,
        country: contact.country,
        city: contact.city,
        state: contact.state,
        zip: contact.zip,
        street: contact.street,
        website: contact.website,
        company: contact.company,
        leadStatus: contact.leadStatus,
        lifecycleStage: contact.lifecycleStage,
        twitter_handle: contact.twitter_handle,
        preferred_language: contact.preferred_language,
        persona: contact.persona,
        banner_url: contact.bannerUrl,
        photo_url: contact.photoUrl,
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => updateContact(data);


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
            Lead: leadStages.find((l) => l.id === contact.leadStatus)?.stage,
            Stage: lifecycleStages.find((l) => l.id === contact.lifecycleStage)?.stage,
            Phone: contact.phone,
            City: contact.city,
            State: contact.state,
            Country: countries.find((c) => c.code === contact.country)?.name,
            Street: contact.street,
            Zip: contact.zip,
            Website: contact.website,
            Persona: contact.persona,
            Twitter: contact.twitter_handle,
            Language: countries.find((c) => c.code === contact.preferred_language)?.language.name,
            Owner: contact?.user?.name,
            Company: <Link href={`/account/${workspaceSlug}/modules/customer-cloud/companies/card/${contact?.companyId}`}>{companies.find((c) => c.id === contact?.companyId)?.companyName}</Link>,
        },
    }

    const updateContact = async (formInput) => {
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

            router.replace(router.asPath)
            toast.success('Contact updated successfully')
        } else {
            toast.error('Contact update failed')
        }
    }

    const uploadLogo = async (file) => {
        const getPhoto = await uploadToGCS(file)
        setPhoto(true)

        const res = await api(`/api/modules/customer-cloud/updatePhoto`, {
            method: 'POST',
            body: {
                id: contact.id,
                logoUrl: getPhoto,
            }
        })
        setPhoto(false)

        if (res.status === 200) {
            router.replace(router.asPath)
            toast.success('Photo updated successfully')
        } else {
            toast.error('Photo update failed')
            setPhoto(false)

        }
    };

    const uploadBanner = async (file) => {
        setBanner(true)
        const getBanner = await uploadToGCS(file)
        const res = await api(`/api/modules/customer-cloud/updateContactsBanner`, {
            method: 'POST',
            body: {
                id: contact.id,
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
                                <input type="file" onChange={(e) => uploadLogo(e.target.files[0])} hidden ref={photoInput} />
                                <div className="relative w-full m-auto">
                                    {photo ?
                                        <div className="w-1/2 h-1/2 absolute top-1/4 left-1/4 p-4">
                                            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        :
                                        <div className="w-1/2 h-1/2 absolute top-1/4 left-1/4 p-4"><PencilIcon className="w-8 h-8 text-gray-500" onClick={e => photoInput.current && photoInput.current.click()} /></div>
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
                                        title="Edit Contact"
                                        subTitle=""
                                        buttonTitle="Edit
                                        "
                                    >
                                        <form onSubmit={handleSubmit(onSubmit)}>

                                            <div className="overflow-scroll h-full pb-20">
                                                <div className="px-4 my-10">
                                                    <div className="mt-1">
                                                        <Controller
                                                            name="salutation"
                                                            id="salutation"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    label="Salutation"
                                                                    {...field}
                                                                >
                                                                    <option value="Mr.">Mr.</option>
                                                                    <option value="Mrs.">Mrs.</option>
                                                                    <option value="Ms.">Ms.</option>

                                                                </Select>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-4 my-10">

                                                    <div className="mt-1">
                                                        <Controller
                                                            name="firstName"
                                                            id="firstName"
                                                            control={control}
                                                            rules={{ required: true }}
                                                            render={({ field }) => (
                                                                <Input
                                                                    label="First Name *"
                                                                    {...field}

                                                                />
                                                            )}
                                                        />
                                                        <p className="text-red-600 mt-1 text-xs">{errors.firstName?.type === 'required' && <p role="alert">First name is required</p>}</p>

                                                    </div>
                                                </div>
                                                <div className="px-4 my-10">
                                                    <div className="mt-1">
                                                        <Controller
                                                            name="lastName"
                                                            id="lastName"
                                                            control={control}
                                                            rules={{ required: true }}
                                                            render={({ field }) => (
                                                                <Input
                                                                    label="Last Name *"
                                                                    {...field}
                                                                />
                                                            )}
                                                        />
                                                        <p className="text-red-600 mt-1 text-xs">{errors.lastName?.type === 'required' && <p role="alert">Last name is required</p>}</p>

                                                    </div>
                                                </div>
                                                <div className="px-4 my-10">

                                                    <div className="mt-1">
                                                        <Controller
                                                            name="contactEmail"
                                                            id="contactEmail"
                                                            rules={{ required: true }}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    label="Email *"
                                                                    autoComplete="email"
                                                                    type="email"
                                                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"                                                        {...field}
                                                                />
                                                            )}
                                                        />
                                                        <p className="text-red-600 mt-1 text-xs">{errors.contactEmail?.type === 'required' && <p role="alert">Email is required</p>}</p>
                                                    </div>
                                                </div>
                                                <div className="px-4 my-10">
                                                    <div className="mt-1">
                                                        <Controller
                                                            name="jobTitle"
                                                            id="jobTitle"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    label="Job Title"
                                                                    {...field}
                                                                />
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
                                                            name="lifecycleStage"
                                                            id="lifecycleStage"
                                                            rules={{ required: true }}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    label="Lifecycle Stage"
                                                                    {...field}
                                                                >
                                                                    {lifecycleStages.map((stage, index) => (
                                                                        <option key={index} value={stage.id}>{stage.stage}</option>
                                                                    )
                                                                    )}
                                                                </Select>
                                                            )}
                                                        />
                                                        <p className="text-red-600 mt-1 text-xs">{errors.firstName?.type === 'required' && <p role="alert">Lifecycle Stage is required</p>}</p>

                                                    </div>
                                                </div>
                                                <div className="px-4 my-10">
                                                    <div className="mt-1">
                                                        <Controller
                                                            name="leadStatus"
                                                            id="leadStatus"
                                                            rules={{ required: true }}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    label="Lead Status"
                                                                    {...field}
                                                                >
                                                                    {leadStages.map((stage, index) => (
                                                                        <option key={index} value={stage.id}>{stage.stage}</option>
                                                                    )
                                                                    )}
                                                                </Select>
                                                            )}
                                                        />
                                                        <p className="text-red-600 mt-1 text-xs">{errors.firstName?.type === 'required' && <p role="alert">Lifecycle Stage is required</p>}</p>

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
                                                            name="country"
                                                            id="country"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    label="Country"
                                                                >
                                                                    {
                                                                        countries.map((country, index) => (
                                                                            <option key={index} value={country.code}>{country.name}</option>
                                                                        )
                                                                        )}
                                                                </Select>
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
                                                <div className="px-4 my-10">
                                                    <div className="mt-1">
                                                        <Controller
                                                            name="persona"
                                                            id="persona"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    label="Persona"
                                                                    {...field}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-4 my-10">
                                                    <div className="mt-1">
                                                        <Controller
                                                            name="twitter_handle"
                                                            id="twitter_handle"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    label="Twitter"
                                                                    {...field}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-4 my-10">
                                                    <div className="mt-1">
                                                        <Controller
                                                            name="preferred_language"
                                                            id="preferred_language"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    label="Language"
                                                                >

                                                                    {
                                                                        countries.map((country, index) => (
                                                                            <option key={index} value={country.code}>{country.language.name}</option>
                                                                        )
                                                                        )}
                                                                </Select>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-shrink-0 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white">

                                                <button
                                                    type="submit"
                                                    className="ml-4 inline-flex justify-center  rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                // onClick={() => createContact()}
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
                    <Overview profile={profile} lat={lat} lng={lng} />
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

const Overview = ({ profile, lat, lng }) => {
    const libraries = useMemo(() => ['places'], []);
    const mapCenter = { lat, lng }

    const onLoad = marker => {
        console.log('marker')
    }
    console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API
    })
    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    console.log(profile.fields)

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
            {lat && lng &&
                <div className="mt-20 w-full ">
                    <Content.Divider />

                    <p className="my-6 text-lg font-bold">Map</p>
                    {isLoaded &&
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={mapCenter}
                            zoom={13}
                            options={{ styles: mapStyles }}
                        >
                            <MarkerF onLoad={onLoad} icon={"http://maps.google.com/mapfiles/ms/icons/red.png"}
                                position={mapCenter} ></MarkerF>
                            <InfoBox position={mapCenter} options={{ closeBoxURL: ``, enableEventPropagation: true }}>
                                <div style={{ backgroundColor: `white`, opacity: 0.75, padding: `12px`, width: '200px' }}>
                                    <div style={{ fontSize: `12px`, fontColor: `#08233B` }}>
                                        {Object.keys(profile.fields).slice(3, 9).map((field) => (
                                            <div key={field} className="sm:col-span-1 mt-2">
                                                <dt className="text-xs font-medium text-gray-500">{field}</dt>
                                                <dd className={`${field === "Lead" && "inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-sm text-gray-800"} ${field === "Stage" && "inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-sm text-gray-800"} mt-2 text-sm`}>{profile.fields[field]}</dd>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </InfoBox>

                            <></>
                        </GoogleMap>
                    }

                </div>
            }
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
    const address = countries.find((c) => c.code === contact.country)?.name + ' ' + contact.city + ' ' + contact.street

    const location = await getMap(address)
    return {
        props: {
            contact: JSON.stringify(contact),
            notes: JSON.stringify(notes),
            calls: JSON.stringify(calls),
            tasks: JSON.stringify(tasks),
            activities: JSON.stringify(activities),
            companies: JSON.stringify(companies),
            lat: location.lat,
            lng: location.lng
        }
    }
}

