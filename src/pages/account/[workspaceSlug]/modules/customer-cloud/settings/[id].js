/* eslint-disable react/no-unescaped-entities */
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
import api from '@/lib/common/api'
import { useState } from 'react';
import { log } from '@/lib/client/log';

function toggle(value) {
    return !value;
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Settings({ modules, workspace, settings }) {
    settings = JSON.parse(settings)
    const [companyName, setCompanyName] = useState(settings[0]?.companyName || '')

    const router = useRouter(false);
    const { workspaceSlug, id } = router.query;


    const defaultValues = {
        companyName: settings[0]?.companyName || '',
        timezone: settings[0]?.timezone || '',
        language: settings[0]?.language || '',
        currency: settings[0]?.currency || '',
        country: settings[0]?.country || '',
        vat: settings[0]?.vat || '',
        description: settings[0]?.description || '',
        email: settings[0]?.email || '',
        street: settings[0]?.street || '',
        city: settings[0]?.city || '',
        state: settings[0]?.state || '',
        zip: settings[0]?.zip || '',
        bank: settings[0]?.bank || '',
        iban: settings[0]?.iban || '',
        bic: settings[0]?.bic || '',
        logo: settings[0]?.logo || '',
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

    const verifyCompany = async () => {

        // const res = await api(`/api/modules/customer-cloud/settings/verify`, {
        //     method: 'POST',
        //     body: {
        //         formInput,
        //         workspaceId: workspace[0].id,
        //         moduleId: modules.id
        //     }
        // })
        // if (res.status === 200) {
        //     toast.success('Company verified successfully')
        //     writeLog()
        //     router.replace(router.asPath)

        // } else {
        //     toast.error('Error verifying company')
        // }
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
                                            <Controller
                                                name="companyName"
                                                id="companyName"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="text"
                                                        autoComplete="companyName"
                                                        onChange={(e) => setCompanyName(e.target.value)}
                                                        {...field}

                                                    />
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => verifyCompany({ companyName: defaultValues.companyName })}
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
                                        <Controller
                                            name="description"
                                            id="description"
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea
                                                    {...field}
                                                    rows={3}
                                                />
                                            )}
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

                                        <Controller
                                            name="email"
                                            id="email"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    autoComplete="email"
                                                />
                                            )}
                                        />

                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Country
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Controller
                                            name="country"
                                            id="country"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    autoComplete="country-name"
                                                >
                                                    {countries.map((country, index) => (
                                                        <option key={index} value={country.code}>{country.name}</option>
                                                    ))}
                                                </Select>
                                            )}
                                        />

                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="street-address" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Street address
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Controller
                                            name="street"
                                            id="street"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    autoComplete="street-address"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        ZIP
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0 flex gap-4">
                                        <Controller
                                            name="zip"
                                            id="zip"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    autoComplete="zip"
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="city"
                                            id="city"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    autoComplete="address-level2"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        State
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Controller
                                            name="state"
                                            id="state"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    autoComplete="address-level1"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="sm:grid sm:grid-cols-2 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <h3 className="text-md font-medium leading-6 text-gray-900">Optional Information</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">These information are needed for Quote and Invoice creation but optional. </p>

                                </div>
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Bank Name
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Controller
                                            name="bank"
                                            id="bank"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    autoComplete="bank"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        IBAN
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Controller
                                            name="iban"
                                            id="iban"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    autoComplete="iban"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        BIC
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Controller
                                            name="bic"
                                            id="bic"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    autoComplete="bic"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Other Information</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">Use a permanent address where you can receive mail.</p>
                            </div>
                            <div className="space-y-6 sm:space-y-5">
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Timezone
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Controller
                                            name="timezone"
                                            id="timezone"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    autoComplete="timezone"
                                                >
                                                    {timezones.map((country, index) => (
                                                        <option key={index} value={country.abbr}>{country.text}</option>
                                                    ))}
                                                </Select>
                                            )}
                                        />

                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Language
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Controller
                                            name="language"
                                            id="language"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    autoComplete="language"
                                                >
                                                    {languages.map((language, index) => (
                                                        <option key={index} value={language.value}>{language.name}</option>
                                                    ))}
                                                </Select>
                                            )}
                                        />

                                    </div>
                                </div>
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Currency
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Controller
                                            name="currency"
                                            id="currency"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    autoComplete="currency"
                                                >
                                                    {countries.map((currency, index) => (
                                                        <option key={index} value={currency.currency.code}>{currency.code + ' | ' + currency.currency.name}</option>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        VAT
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0 w-32">
                                        <Controller
                                            name="vat"
                                            id="vat"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="relative mt-1 flex items-center">

                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        autoComplete="vat"
                                                    />
                                                    <div className="absolute inset-y-0 items-center right-3 text-gray-500 flex py-1.5 pr-1.5">
                                                        %
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Activate Shopfront
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <Controller
                                            name="active"
                                            id="active"
                                            control={control}
                                            render={({ field: props }) => (
                                                <Input
                                                    {...props}
                                                    type="checkbox"
                                                    checked={props.value}
                                                    onChange={(e) => props.onChange(e.target.checked)}
                                                    className="w-4 h-4"
                                                />
                                            )}
                                        />
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