import Button from '@/components/Button';
import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import { AccountLayout } from '@/layouts/index';
import { log } from '@/lib/client/log';
import api from '@/lib/common/api';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}



function CreateModule({ workspace, isTeamOwner }) {
    workspace = JSON.parse(workspace);

    const router = useRouter();
    const { workspaceSlug, mod } = router.query;

    const [name, setName] = useState("");
    const [network, setNetwork] = useState("vaga");

    const createModule = async (e) => {
        e.preventDefault();

        if (!name || !network) return alert("Please fill out all fields");
        if (isTeamOwner) {
            const res = await api(`/api/modules/module`, {
                method: 'PUT',
                body: {
                    workspace: workspace[0].id,
                    name,
                    type: mod,
                    network,
                }
            })
            if (res.status === 200) {
                writeLog()
                toast.success("Module created successfully");
                router.push(`/account/${workspaceSlug}`, `/account/${workspaceSlug}`)
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    const writeLog = async () => {
        const res = await log('Module created', `Module ${mod} with the name ${name} created for Workspace: ${workspace[0].id} `, 'module_created', '127.0.0.1');
    }

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Modules | Dashboard`} />
            <Content.Title
                title="Create Module"
                subtitle="Modules overview and creation"
            />
            <Content.Divider />
            <Content.Container>
                <form onSubmit={createModule} className="space-y-8 ">
                    <div className="sm:col-span-6">
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                            Module Name
                        </label>
                        <div className="mt-1">
                            <Input label="Module Name" placeholder="Module Name" onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>
                    <div className="sm:col-span-6">
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                            Network
                        </label>
                        <div className="mt-1">
                            <Select label="Module Name" placeholder="Module Name" onChange={(e) => setNetwork(e.target.value)} >
                                <option value="vaga">VagaChain</option>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" className="bg-red-600 text-white">Create</Button>
                    </div>
                </form>
            </Content.Container>
        </AccountLayout >
    )
}

export default CreateModule

export async function getServerSideProps(context) {
    const session = await getSession(context);
    let isTeamOwner = false;
    let workspace = null;

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
        }
    }
}