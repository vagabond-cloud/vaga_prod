import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import SlideOver from '@/components/SlideOver';
import { dealStage, types } from '@/config/modules/crm';
import { AccountLayout } from '@/layouts/index';
import { log } from '@/lib/client/log';
import { contactActivity } from '@/lib/client/log';
import api from '@/lib/common/api';
import { getAllInvoices, getAllQuotes, getModule, getCRMSettings } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

function Filing({ invoices, quotes, settings }) {
    quotes = JSON.parse(quotes)
    invoices = JSON.parse(invoices)
    settings = JSON.parse(settings)[0]
    const router = useRouter();
    const { workspaceSlug, id } = router.query;

    const category = "quote"
    const allDocs = [...quotes, ...invoices]
    console.log(allDocs)
    return (
        <AccountLayout>
            <Meta title={`Vagabond - Deals | Dashboard`} />
            <Content.Title
                title={'Document Filing'}
                subtitle={'Manage your documents'}
            />
            <Content.Container>
                <div>
                    <div className="w-full px-4 mt-10">
                        {allDocs.map((item, index) => (
                            <Link href={`/account/${workspaceSlug}/modules/customer-cloud/deals/card/${category}/${item.id}/${item.dealId}`} key={index} className="">
                                <div className="p-4 cursor-pointer pointer-events-auto w-full max-w-full overflow-hidden rounded-lg bg-white ring-1 ring-black ring-opacity-5 my-4 hover:bg-gray-100">
                                    <div className="flex items-between">
                                        <div className="ml-3 w-0 flex-1 pt-0.5">
                                            <div className="flex justify-between">
                                                <p className="text-sm font-medium text-gray-900">{item.clientName} </p>
                                            </div>
                                            <p className="text-xs text-gray-400 truncate pr-8 my-2">{item?.item?.reduce((a, b) => a + parseFloat(b.price * b.amount), 0)?.toLocaleString(settings.country, { style: 'currency', currency: settings.currency })}</p>
                                            <p className="text-xs text-gray-400 truncate pr-8 my-2">{moment(item.createdAt).format("DD MMM. YYYY - hh:mm:ss")}</p>

                                        </div>
                                        <div className="flex pt-0.5 items-center justify-end">
                                            <p className="text-sm font-medium text-green-600 mr-6">{item.quoteNumber ? "Quote" : "Invoice"} </p>

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
                </div>
            </Content.Container>
        </AccountLayout>
    )
}

export default Filing


export async function getServerSideProps(context) {


    //This retrieves the current session using the getSession function and assigns it to the session variable.
    const session = await getSession(context);

    //These two variables are initialized as false and null respectively. 
    //They are used to store whether the current user is a team owner and the current workspace.
    let isTeamOwner = false;
    let workspace = null;

    //This retrieves the module data using the getModule function and assigns it to the modules variable. 
    //It takes the id from the params property of the context object.
    const modules = await getModule(context.params.id);

    const quotes = await getAllQuotes(modules.id);
    const invoices = await getAllInvoices(modules.id);
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
            quotes: JSON.stringify(quotes),
            invoices: JSON.stringify(invoices),
            settings: JSON.stringify(settings)
        }
    }
}