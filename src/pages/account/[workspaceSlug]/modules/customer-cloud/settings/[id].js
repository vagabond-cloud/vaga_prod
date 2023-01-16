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
import { getModule } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}



function Settings({ modules }) {
    modules = JSON.parse(modules)

    const [filterStage, updateFilterStage] = useState('All')

    const [formInput, updateFormInput] = useState({
        dealName: '',
        pipeline: '',
        dealStage: '',
        amount: '',
        closeDate: '',
        dealOwnerId: '',
        dealType: '',
        priority: '',
        linkContactId: '',
        linkCompanyId: '',
        linkProjectId: '',
    })

    const router = useRouter(false);
    const { workspaceSlug, id } = router.query;

    const createContact = async () => {
        const res = await api(`/api/modules/deal`, {
            method: 'PUT',
            body: {
                formInput,
                workspaceId: workspace[0].id,
                moduleId: modules.id
            }
        })
        if (res.status === 200) {
            toast.success('Deal created successfully')
            writeLog()
            router.replace(router.asPath)

        } else {
            toast.error('Error creating Deal')
        }
    }

    console.log(modules)

    const writeLog = async () => {
        const res = await log('Deal created', `Deal with the name ${formInput.dealName} created for Module: ${id} `, 'deal_created', '127.0.0.1');
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
                <div className="px-4 my-10">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Company Name
                    </label>
                    <div className="mt-1">
                        <Input
                            type="text"
                            onChange={(e) => updateFormInput({ ...formInput, companyName: new Date(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="px-4 my-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Time zone
                    </label>
                    <div className="mt-1">
                        <Select
                            onChange={(e) => updateFormInput({ ...formInput, projectId: e.target.value })}
                        >
                            <option value="" className="text-gray-400">Choose a Time Zone</option>

                            {
                                timezones.map((stage, index) => (
                                    <option key={index} value={stage.id}>{stage.text}</option>
                                )
                                )}
                        </Select>
                    </div>
                </div>

                <div className="px-4 my-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Time zone
                    </label>
                    <div className="mt-1">
                        <Select
                            onChange={(e) => updateFormInput({ ...formInput, projectId: e.target.value })}
                        >
                            <option value="" className="text-gray-400">Choose a Language</option>

                            {
                                languages.map((stage, index) => (
                                    <option key={index} value={stage.value}>{stage.name}</option>
                                )
                                )}
                        </Select>
                    </div>
                </div>
                <div className="px-4 my-10">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Close Date
                    </label>
                    <div className="mt-1">
                        <Input
                            type="text"
                            onChange={(e) => updateFormInput({ ...formInput, closeDate: new Date(e.target.value) })}
                        />
                    </div>
                </div>
            </Content.Container >
        </AccountLayout >
    )
}

export default Settings


export async function getServerSideProps(context) {

    const session = await getSession(context);
    let isTeamOwner = false;
    let workspace = null;

    const modules = await getModule(context.params.id);

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

        }
    }
}