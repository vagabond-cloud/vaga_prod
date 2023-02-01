import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import { AccountLayout } from '@/layouts/index';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { getCompanies, getDeals, getDealContacts, getModule, getCRMSettings } from '@/prisma/services/modules';
import { calculateTotal } from '@/lib/server/modules/custom-cloud/calculate';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function CustomerCloud({ deals, total, contacts, settings }) {
    deals = JSON.parse(deals)
    contacts = JSON.parse(contacts)
    settings = JSON.parse(settings)[0]

    const router = useRouter();
    const { workspaceSlug, id } = router.query;

    console.log(settings)

    const stats = [
        { name: 'Total Sales', stat: total.toLocaleString(settings.language, { style: 'currency', currency: "EUR" }) },
        { name: 'Total Deals', stat: deals.length },
        { name: 'Total Clients', stat: contacts.length },
    ]

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Modules | Dashboard`} />
            <Content.Title
                title="Customer Cloud"
                subtitle="Manage your Sales and Customer processes"
            />
            <Content.Divider />
            <Content.Container>

                <div>
                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                        {stats.map((item) => (
                            <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="">
                    <p className="text-lg text-gray-800 mt-2">Overview</p>
                    <p className="text-sm text-gray-400 ">Module and Smart Contract information</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/${id}`}>
                            <div className="bg-teal-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="Contacts" subtitle="">

                                    <p className="text-xs ">Manage your contacts</p>

                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/companies/${id}`}>
                            <div className="bg-green-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="Companies" subtitle="">

                                    <p className="text-xs ">Manage your companies</p>

                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/marketing/${id}`}>
                            <div className="bg-purple-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="Marketing" subtitle="">
                                    <div className="">
                                        <p className="text-xs ">Manage your campaigns</p>
                                    </div>
                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/deals/${id}`}>
                            <div className="bg-slate-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="Sales" subtitle="">

                                    <p className="text-xs ">Manage your sales pipeline</p>

                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/service/${id}`}>
                            <div className="bg-amber-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">

                                <Card.Body title="Service" subtitle="">
                                    <div className="">
                                        <p className="text-xs ">Manage your Customer requests</p>
                                    </div>
                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/products/${id}`}>
                            <div className="bg-orange-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">

                                <Card.Body title="Products" subtitle="">
                                    <div className="">
                                        <p className="text-xs ">Manage your Products</p>
                                    </div>
                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/projects/${id}`}>
                            <div className="bg-lime-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">

                                <Card.Body title="Projects" subtitle="">
                                    <div className="">
                                        <p className="text-xs ">Manage your Projects</p>
                                    </div>
                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/projects/${id}`}>
                            <div className="bg-emerald-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">

                                <Card.Body title="Documents" subtitle="">
                                    <div className="">
                                        <p className="text-xs ">Manage your Documents</p>
                                    </div>
                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/filing/${id}`}>
                            <div className="bg-cyan-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">

                                <Card.Body title="Invoices" subtitle="">
                                    <div className="">
                                        <p className="text-xs ">Manage your Invoices</p>
                                    </div>
                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/settings/${id}`}>
                            <div className="bg-gray-700 hover:bg-gray-800 text-gray-100 hover:text-gray-200 cursor-pointer">

                                <Card.Body title="Settings" subtitle="">
                                    <div className="">
                                        <p className="text-xs ">Manage your Settings</p>
                                    </div>
                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                </div>
                <div className="">
                    <p className="text-lg text-gray-800 mt-2">Helpful Information</p>
                </div>
                <div className="">
                    <Card>
                        <Card.Body title="How to use contacts" subtitle="">
                            <p className="text-sm text-gray-400">Lorem Ipsum</p>
                        </Card.Body>
                    </Card>
                </div>
            </Content.Container>
        </AccountLayout >
    )
}

export default CustomerCloud

// This is an exported async function that takes in a single argument, context, which is an object containing information about the current request.
export async function getServerSideProps(context) {

    //This destructures the query property of the context object to extract the page and filter variables. 
    //These variables are used to determine the current page number and the filter criteria for the data being retrieved.
    const { page, filter } = context.query;

    //This retrieves the current session using the getSession function and assigns it to the session variable.
    const session = await getSession(context);

    //These two variables are initialized as false and null respectively. 
    //They are used to store whether the current user is a team owner and the current workspace.
    let isTeamOwner = false;
    let workspace = null;

    //This retrieves the module data using the getModule function and assigns it to the modules variable. 
    //It takes the id from the params property of the context object.
    const modules = await getModule(context.params.id);

    //This retrieves the companies data using the getCompanies function and assigns it to the companies variable. 
    //It takes the id from the modules variable.
    const companies = await getCompanies(modules.id)

    //This retrieves the deals data using the getDealByStage function and assigns it to the deals variable. 
    //It takes the current page number (or 1 if no page number is provided), the number of deals per page, the sorting criteria, the filter criteria and the id of the modules.
    const deals = await getDeals(modules.id)

    //This retrieves the contacts data using the getDealContacts function and assigns it to the contacts variable. 
    //It takes the id of the modules.

    const contacts = await getDealContacts(modules.id)

    //If a session exists, it retrieves the workspace data using the getWorkspace function and assigns it to the workspace variable. 
    //Then it checks if the current user is the owner of the workspace using the isWorkspaceOwner function and assigns it to the isTeamOwner variable.

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
    const settings = await getCRMSettings(modules.id)

    const total = await calculateTotal(deals)
    //This returns an object that contains the props that will be passed to the component. 
    //These props include isTeamOwner, workspace, modules, companies, deals, total and contacts. 
    //These variables are all stringified before being returned.

    return {
        props: {
            isTeamOwner,
            workspace: JSON.stringify(workspace),
            modules: JSON.stringify(modules),
            companies: JSON.stringify(companies),
            deals: JSON.stringify(deals),
            contacts: JSON.stringify(contacts),
            total,
            settings: JSON.stringify(settings)
        }
    }
}