import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import SlideOver from '@/components/SlideOver';
import { countries } from '@/config/common/countries';
import { leadStages, lifecycleStages } from '@/config/modules/crm';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { getAllContacts, getModule } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, Controller } from "react-hook-form";
import Pagniation from '@/components/Pagination/';

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function Contacts({ modules, contacts, workspace, total }) {
    modules = JSON.parse(modules)
    contacts = JSON.parse(contacts)
    workspace = JSON.parse(workspace)

    const router = useRouter();
    const { workspaceSlug, id, page } = router.query;

    const defaultValues = {
        salutation: '',
        firstName: '',
        lastName: '',
        contactEmail: '',
        jobTitle: '',
        phone: '',
        country: '',
        city: '',
        state: '',
        zip: '',
        street: '',
        website: '',
        company: '',
        leadStatus: '',
        lifecycleStage: '',
        twitter_handle: '',
        preferred_language: '',
        persona: '',
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => createContact(data);

    const createContact = async (formInput) => {
        try {
            const res = await api(`/api/modules/contact`, {
                method: 'PUT',
                body: {
                    formInput,
                    workspaceId: workspace[0].id,
                    moduleId: modules.id
                }
            });
            if (res.status === 200) {
                writeLog();
                router.replace(router.asPath);
            } else {
                toast.error('Error creating contact');
            }
        } catch (error) {
            toast.error(`Error creating contact: ${error.response ? error.response.data.message : error.message}`);
        }
    };

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
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="overflow-scroll h-full pb-20">
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="salutation"
                                            id="salutation"
                                            control={control}
                                            render={({ field }) => (
                                                <Select label="Salutation" {...field}>
                                                    <option value="Mr.">Mr.</option>
                                                    <option value="Mrs.">Mrs.</option>
                                                    <option value="Ms.">Ms.</option>
                                                </Select>
                                            )}
                                        />
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
                                            <div className="text-red-600 mt-1 text-xs">{errors.firstName?.type === 'required' && <p role="alert">First name is required</p>}</div>

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
                                            <div className="text-red-600 mt-1 text-xs">{errors.lastName?.type === 'required' && <p role="alert">Last name is required</p>}</div>

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
                                            <div className="text-red-600 mt-1 text-xs">{errors.contactEmail?.type === 'required' && <p role="alert">Email is required</p>}</div>
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
                                            <div className="text-red-600 mt-1 text-xs">{errors.lifecycleStage?.type === 'required' && <p role="alert">Lifecycle Stage is required</p>}</div>

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

                                        </div>
                                        <div className="text-red-600 mt-1 text-xs">{errors.leadStatus?.type === 'required' && <p role="alert">Lead Status is required</p>}</div>

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
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 flex gap-2 items-center">
                                                        <img src={person.photoUrl ? person.photoUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpSzm6trHP-RsKzrcPheEo7wpUO-Zlcle5ffnIZY7HesXZt-IZNAOn4xjD4yDRNeVTawU&usqp=CAU"} className="w-8 h-8 rounded-full" alt="" />
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
                    <Pagniation page={page} total={total} />

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
    const contacts = await getAllContacts(!page ? 1 : page, 10, { id: 'asc' }, modules.id)

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
            contacts: JSON.stringify(contacts?.contacts),
            total: contacts.total
        }
    }
}