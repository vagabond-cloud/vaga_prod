import Button from '@/components/Button';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import { types } from '@/config/workspace-overview/module-types';
import { AccountLayout } from '@/layouts/index';
import { getModule } from '@/prisma/services/modules';
import { getUser } from '@/prisma/services/user';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function ProductPass({ isWorkspaceOwner, workspace, modules, user }) {
    workspace = JSON.parse(workspace);
    modules = JSON.parse(modules);

    const router = useRouter();
    const { workspaceSlug, mod, id } = router.query;

    const goToMaterials = () => {
        router.push(`/account/${workspaceSlug}/modules/product-pass/materials/${id}`)
    }

    const goToLocations = () => {
        router.push(`/account/${workspaceSlug}/modules/product-pass/locations/${id}`)
    }

    return (
        <AccountLayout>
            <Meta title={`Vagabond - ProductPass | Dashboard`} />
            <Content.Title
                title="Product Pass"
                subtitle="Manage your Product Passes here"
            />
            <Content.Divider />
            <Content.Container>
                <div className="">
                    <p className="text-lg text-gray-800 mt-2">Overview</p>
                    <p className="text-sm text-gray-400 ">Module and Smart Contract information</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <Card.Body title="Module" subtitle={types.find((t) => t.type === modules.type).name}>
                            <p className="text-xs text-gray-400">{modules.moduleCode}</p>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body title="Network" subtitle={modules.network.toUpperCase()}>
                            <div className="">
                                <p className="text-xs text-gray-400">
                                    {
                                        !user?.vaga_address
                                            ? "NO ADDRESS"
                                            : user?.vaga_address
                                    }
                                </p>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <div className="w-full items-center flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Deploy a dedicated smart contract</p>
                                </div>
                                <div className="h-12">
                                    {user?.vaga_address ?
                                        <Button
                                            className="bg-red-600 text-white hover:bg-red-500"
                                        >
                                            Deploy
                                        </Button>
                                        :
                                        ""
                                    }
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </div>
                <div className="">
                    <p className="text-lg text-gray-800 mt-10">Product Wizard</p>
                    <p className="text-sm text-gray-400 ">Use the ProductPass assistant to set up your ProductPass in minutes</p>
                </div>
                <div className="">
                    <Card>
                        <div className="bg-gray-100">
                            <Card.Body title="Create a Product Pass" subtitle="Follow the easy steps to create  your ProductPass in minutes">
                                <Button className="bg-red-600 text-white w-60 my-6">Start</Button>
                            </Card.Body>
                        </div>
                    </Card>
                </div>
                <div className="">
                    <p className="text-lg text-gray-800 mt-10">Product details</p>
                    <p className="text-sm text-gray-400 ">Create Materials, set your Locations</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <Card>
                        <Card.Body title="Materials" subtitle="Information about all Materials">
                            <Button className="bg-red-600 text-white my-6 hover:bg-red-500" onClick={() => goToMaterials()}>Open</Button>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body title="Location" subtitle="Information about all sites in your company.">
                            <Button className="bg-red-600 text-white my-6 hover:bg-red-500" onClick={() => goToLocations()}>Open</Button>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body title="Product Dashboard" subtitle="360° - Life Cycle Management">
                            <Link href={`/account/${workspaceSlug}/modules/product-pass/dashboard/${id}`} >
                                <Button className="bg-red-600 text-white w-full my-6 hover:bg-red-500" >Open</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </div>

            </Content.Container>
        </AccountLayout >
    )
}

export default ProductPass

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

    const user = await getUser(session.user.userId);

    return {
        props: {
            isTeamOwner,
            workspace: JSON.stringify(workspace),
            modules: JSON.stringify(modules),
            user
        }
    }
}

