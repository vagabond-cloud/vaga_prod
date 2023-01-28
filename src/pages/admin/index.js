import React from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import { getSession } from 'next-auth/react';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Admin({ session }) {
    const router = useRouter()
    const { workspaceSlug, id } = router.query

    return (
        <AdminLayout>
            <Content.Container>
                <div>
                    <h1 className="text-lg font-bold">
                        Admin Panel
                    </h1>
                </div>

                <div className="">
                    <p className="text-lg text-gray-800 mt-2">Overview</p>
                    <p className="text-sm text-gray-400 ">Module and Smart Contract information</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <Link href={`/admin/users`}>
                            <div className="bg-teal-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="User Management" subtitle="">
                                    <p className="text-xs ">Manage Users</p>
                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/${id}`}>
                            <div className="bg-green-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="Workspace Management" subtitle="">
                                    <p className="text-xs ">Manage Workspaces</p>
                                </Card.Body>
                            </div>
                        </Link>
                    </Card>

                </div>
            </Content.Container>
        </AdminLayout>

    )
}

export default Admin


export const getServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session.user.role === 'admin') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }

    }

    return {
        props: {
            session
        },
    };
};
