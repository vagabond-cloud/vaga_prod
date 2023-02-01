import { AccountLayout } from '@/layouts/index';
import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import Button from '@/components/Button/index';
import Textarea from '@/components/Textarea';
import { useForm, Controller } from "react-hook-form";
import { countries } from '@/config/common/countries';
import { timezones } from '@/config/common/timezones';
import { languages } from '@/config/common/languages';
import { getModule, getCRMSettings } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function Settings({ modules, workspace, settings }) {


    const defaultValues = {
        companyName: settings[0]?.companyName || '',
        timezone: settings[0]?.timezone || '',
        language: settings[0]?.language || '',
        currency: settings[0]?.currency || '',
        country: settings[0]?.country || '',
        vat: settings[0]?.vat || '',
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => updateSettings(data);

    const updateSettings = async (formInput) => {
        if (settings.length === 0) {
            const res = await api(`/api/modules/customer-cloud/settings`, {
                method: 'POST',
                body: {
                    formInput,
                    workspaceId: workspace[0].id,
                    moduleId: modules.id
                }
            })
            if (res.status === 200) {
                toast.success('Settings created successfully')
                writeLog()
                router.replace(router.asPath)

            } else {
                toast.error('Error creating Settings')
            }
        } else {
            const res = await api(`/api/modules/customer-cloud/settings`, {
                method: 'PUT',
                body: {
                    formInput,
                    workspaceId: workspace[0].id,
                    moduleId: modules.id,
                    id: settings[0].id
                }
            })
            if (res.status === 200) {
                toast.success('Settings updated successfully')
                writeLog()
                router.replace(router.asPath)

            } else {
                toast.error('Error updating Settings')
            }
        }
    }

    const writeLog = async () => {
        const res = await log('CRM Settings Updated', `Settings for ${defaultValues.companyName} created for Module: ${id} `, 'settings_created', '127.0.0.1');
    }


    return (
        <AccountLayout>
            <Meta title={`Vagabond - Settings | Dashboard`} />
            <Content.Title
                title="Settings"
                subtitle="Overview of your settings"
            />
            <Content.Divider />
            <Content.Container>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-8 ">
                        <div className="space-y-6 sm:space-y-5">

                            <div className="space-y-6 sm:space-y-5">
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Company Name
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0 ">
                                        <div className="flex gap-4 mt-1  rounded-md shadow-sm">
                                            <Input
                                                type="text"
                                                name="companyName"
                                                id="companyName"
                                                autoComplete="companyName"
                                            />
                                            <Button
                                                className="bg-red-600 text-white mt-1 w-20">
                                                Verify
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        About
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Textarea
                                            id="description"
                                            name="description"
                                            rows={3}
                                            defaultValue={''}
                                        />
                                        <p className="mt-2 text-sm text-gray-500">Write a few sentences about your company.</p>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                                        Logo
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <div className="flex items-center">
                                            <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                                                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </span>
                                            <Button
                                                type="button"
                                                className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                            >
                                                Change
                                            </Button>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>

                        <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Company Information</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">Use a permanent address where you can receive mail.</p>
                            </div>
                            <div className="space-y-6 sm:space-y-5">


                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Email address
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Country
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Select
                                            id="country"
                                            name="country"
                                            autoComplete="country-name"
                                        >
                                            <option>United States</option>
                                            <option>Canada</option>
                                            <option>Mexico</option>
                                        </Select>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="street-address" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Street address
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Input
                                            type="text"
                                            name="street-address"
                                            id="street-address"
                                            autoComplete="street-address"
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        City
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Input
                                            type="text"
                                            name="city"
                                            id="city"
                                            autoComplete="address-level2"
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:max-w-xs sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        State
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Input
                                            type="text"
                                            name="region"
                                            id="region"
                                            autoComplete="address-level1"
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:max-w-xs sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        ZIP
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Input
                                            type="text"
                                            name="postal-code"
                                            id="postal-code"
                                            autoComplete="postal-code"
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:max-w-xs sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 divide-y divide-gray-200 pt-8 sm:space-y-5 sm:pt-10">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    We'll always let you know about important changes, but you pick what else you want to hear about.
                                </p>
                            </div>
                            <div className="space-y-6 divide-y divide-gray-200 sm:space-y-5">
                                <div className="pt-6 sm:pt-5">
                                    <div role="group" aria-labelledby="label-email">
                                        <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
                                            <div>
                                                <div className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700" id="label-email">
                                                    By Email
                                                </div>
                                            </div>

                                            <div className="mt-4 sm:col-span-2 sm:mt-0">
                                                <div className="max-w-lg space-y-4">
                                                    <div className="relative flex items-start">
                                                        <div className="flex h-5 items-center">
                                                            <Controller
                                                                name="companyName"
                                                                id="companyName"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        id="comments"
                                                                        name="comments"
                                                                        type="checkbox"
                                                                    />
                                                                )}
                                                            />

                                                        </div>
                                                        <div className="ml-3 text-sm">
                                                            <label htmlFor="comments" className="font-medium text-gray-700">
                                                                Comments
                                                            </label>
                                                            <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                                                        </div>
                                                    </div>
                                                    <div className="relative flex items-start">
                                                        <div className="flex h-5 items-center">
                                                            <Input
                                                                id="candidates"
                                                                name="candidates"
                                                                type="checkbox"
                                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                            />
                                                        </div>
                                                        <div className="ml-3 text-sm">
                                                            <label htmlFor="candidates" className="font-medium text-gray-700">
                                                                Candidates
                                                            </label>
                                                            <p className="text-gray-500">Get notified when a candidate applies for a job.</p>
                                                        </div>
                                                    </div>
                                                    <div className="relative flex items-start">
                                                        <div className="flex h-5 items-center">
                                                            <Input
                                                                id="offers"
                                                                name="offers"
                                                                type="checkbox"
                                                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                            />
                                                        </div>
                                                        <div className="ml-3 text-sm">
                                                            <label htmlFor="offers" className="font-medium text-gray-700">
                                                                Offers
                                                            </label>
                                                            <p className="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-5">
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
            </Content.Container>
        </AccountLayout>
    )
}



export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (!session) {
        return { props: { isTeamOwner: false, workspace: null, modules: null } }
    }
    const workspace = await getWorkspace(
        session.user.userId,
        session.user.email,
        context.params.workspaceSlug
    );
    const modules = await getModule(context.params.id);
    const settings = await getCRMSettings(modules.id)
    const isTeamOwner = isWorkspaceOwner(session.user.email, workspace);

    return {
        props: {
            isTeamOwner,
            workspace: JSON.stringify(workspace),
            modules: JSON.stringify(modules),
            settings: JSON.stringify(settings)
        }
    }
}