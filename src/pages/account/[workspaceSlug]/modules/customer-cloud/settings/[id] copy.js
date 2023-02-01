import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import SlideOver from '@/components/SlideOver';
import { countries } from '@/config/common/countries';
import { timezones } from '@/config/common/timezones';
import { languages } from '@/config/common/languages';
import { dealStage, industries, types } from '@/config/modules/crm';
import { AccountLayout } from '@/layouts/index';
import { log } from '@/lib/client/log';
import api from '@/lib/common/api';
import { getModule, getCRMSettings } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { useForm, Controller } from "react-hook-form";
import Button from '@/components/Button';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


function Settings({ modules, workspace, settings }) {
    modules = JSON.parse(modules)
    workspace = JSON.parse(workspace)
    settings = JSON.parse(settings)
    console.log(settings)
    const router = useRouter(false);
    const { workspaceSlug, id } = router.query;

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

                    <div className="grid grid-cols-2 gap-4 pb-20">
                        <div className="px-4 my-4">
                            <div className="mt-1">
                                <Controller
                                    name="companyName"
                                    id="companyName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            label="Company Name"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="px-4 my-4">
                            <div className="mt-1">
                                <Controller

                                    name="timezone"
                                    id="timezone"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="Timezone"
                                            {...field}
                                        >
                                            {timezones.map((timezone, index) => (
                                                <option key={index} value={timezone.abbr}>
                                                    {timezone.text}
                                                </option>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="px-4 my-4">
                            <div className="mt-1">
                                <Controller

                                    name="language"
                                    id="language"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="Language"
                                            {...field}
                                        >
                                            {languages.map((language, index) => (
                                                <option key={index} value={language.value}>
                                                    {language.name}
                                                </option>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="px-4 my-4">
                            <div className="mt-1">
                                <Controller

                                    name="currency"
                                    id="currency"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="Currency"
                                            {...field}
                                        >
                                            {countries.map((country, index) => (
                                                <option key={index} value={country.currency.code}>
                                                    {country.currency.name}
                                                </option>
                                            ))}
                                        </Select>
                                    )}
                                />

                            </div>
                        </div>
                        <div className="px-4 my-4">
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
                                            {countries.map((country, index) => (
                                                <option key={index} value={country.code}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="px-4 my-4">
                            <div className="mt-1">
                                <Controller
                                    name="vat"
                                    id="vat"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            label="VAT (%)"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="w-full px-4 flex justify-end col-span-2">
                            <Button
                                type="submit"
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
            </Content.Container >
        </AccountLayout >
    )
}

export default Settings


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