import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import Reload from '@/components/Reload';
import { AccountLayout } from '@/layouts/index';
import { useRouter } from 'next/router';
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { items } from '@/config/modules/items'
import Link from 'next/link'
import { getModule } from '@/prisma/services/modules';
import { getSession } from 'next-auth/react';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { types } from '@/config/workspace-overview/module-types';
import Button from '@/components/Button';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}



/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function ProductDashboard({ isWorkspaceOwner, workspace, modules }) {
    workspace = JSON.parse(workspace);
    modules = JSON.parse(modules);

    const router = useRouter();
    const { workspaceSlug, mod, id } = router.query;

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Product Dashboard | Dashboard`} />
            <Content.Title
                title="Product Dashboard"
                subtitle="Overview of your Product Passes and Services"
            />
            <Content.Divider />
            <Content.Container>
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/product-pass/dashboard/pass/${id}`}>
                            <div className="bg-teal-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="Product Pass" subtitle="">

                                    <p className="text-xs ">Manage your Product Passes</p>

                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/product-pass/dashboard/inventory/${id}`}>
                            <div className="bg-green-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="Inventory" subtitle="">

                                    <p className="text-xs ">Manage your Inventory</p>

                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/product-pass/dashboard/pass/${id}`}>
                            <div className="bg-red-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="Product Pass" subtitle="">

                                    <p className="text-xs ">Manage your Product Passes</p>

                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/product-pass/dashboard/pass/${id}`}>
                            <div className="bg-gray-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="Inventory" subtitle="">

                                    <p className="text-xs ">Manage your Inventory</p>

                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                </div>
            </Content.Container>
        </AccountLayout >
    )
}

export default ProductDashboard

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