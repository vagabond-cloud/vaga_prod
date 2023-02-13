import Button from '@/components/Button';
import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import Pagniation from '@/components/Pagination/';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { getAllDocuments, getCRMSettings, getModule } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function Filing({ documents, settings, total }) {
    documents = JSON.parse(documents)
    settings = JSON.parse(settings)[0]

    const router = useRouter();
    const { workspaceSlug, id, page } = router.query;
    const [keyword, setKeyword] = useState('')
    const [docs, setDocs] = useState(documents)

    const searchDocuments = async (e) => {
        if (!e) return;
        setDocs([])
        const search = await api(`/api/modules/customer-cloud/searchDocuments?title=${keyword}&type=${keyword}`, {
            method: 'GET',

        })
        if (search.status === 200) {
            setDocs(search.documents)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            searchDocuments(event)
        }
    }

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Deals | Dashboard`} />
            <Content.Title
                title={'Document Filing'}
                subtitle={'Manage your documents'}
            />
            <Content.Container>
                <div>
                    <div className="flex gap-4 items-center px-4">
                        <Input type="text" placeholder="Search" className="-ml-4 sm:w-full xs:w-60" onKeyDown={handleKeyDown} onChange={(e) => setKeyword(e.target.value)} />
                        <Button className="bg-red-600 text-white" onClick={searchDocuments}>Search</Button>
                    </div>
                    <div className="w-full px-4 mt-10">
                        {docs?.map((item, index) => (
                            <Link href={item.documentUrl} key={index} target="_blank" className="">
                                <div className="p-4 cursor-pointer pointer-events-auto w-full max-w-full overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100">
                                    <div className="flex items-between">
                                        <div className="ml-3 w-0 flex-1 pt-0.5">
                                            <div className="flex justify-between">
                                                <p className="text-sm font-medium text-gray-900">{item.title} </p>
                                            </div>
                                            <p className="text-xs text-gray-400 truncate pr-8 my-2">{moment(item.createdAt).format("DD MMM. YYYY - hh:mm:ss") + ' | ' + parseFloat(item.size / 1000000).toFixed(2) + 'MB'}</p>

                                        </div>
                                        <div className="flex pt-0.5 items-center justify-end">
                                            <p className="text-sm font-medium text-green-600 mr-6">{item.type} </p>

                                            <ChevronRightIcon className="h-5 w-5 text-gray-800" />
                                        </div>
                                        <div className="ml-4 flex flex-shrink-0">
                                            <div className="block w-full">
                                                <button
                                                    type="button"
                                                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                >
                                                    <span className="sr-only">Close</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Pagniation page={page} total={total} />
                </div>
            </Content.Container>
        </AccountLayout>
    )
}

export default Filing


export async function getServerSideProps(context) {

    const { page } = context.query

    //This retrieves the current session using the getSession function and assigns it to the session variable.
    const session = await getSession(context);

    //These two variables are initialized as false and null respectively. 
    //They are used to store whether the current user is a team owner and the current workspace.
    let isTeamOwner = false;
    let workspace = null;

    //This retrieves the module data using the getModule function and assigns it to the modules variable. 
    //It takes the id from the params property of the context object.
    const modules = await getModule(context.params.id);

    const documents = await getAllDocuments(!page ? 1 : page, 10, { id: 'asc' }, session.user.userId);
    const settings = await getCRMSettings(modules.id)

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

    //These props include isTeamOwner, workspace, modules, companies, deals, total and contacts. 
    //These variables are all stringified before being returned.



    return {
        props: {
            isTeamOwner,
            workspace: JSON.stringify(workspace),
            modules: JSON.stringify(modules),
            documents: JSON.stringify(documents.document),
            total: documents.total,
            settings: JSON.stringify(settings)
        }
    }
}