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
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react'
import Calendra from '@/components/modules/customer-cloud/Overview/Calendra';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function CustomerCloud({ deals, total, contacts, settings, session }) {
    deals = JSON.parse(deals)
    contacts = JSON.parse(contacts)
    settings = JSON.parse(settings)[0]
    session = JSON.parse(session)

    const user = session.user.userId

    const router = useRouter();
    const { workspaceSlug, id } = router.query;

    const [date, setDate] = useState([])
    const [closeDate, setCloseDate] = useState([])

    const stats = [
        { name: 'Total Sales', stat: total.toLocaleString(settings.language, { style: 'currency', currency: "EUR" }) },
        { name: 'Total Deals', stat: deals.filter((u) => u.dealOwnerId === user).length },
        { name: 'Total Clients', stat: contacts.filter((u) => u.contactOwnerId === user).length },
    ]

    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30))
    const data = deals.filter((deal) => {
        return new Date(deal.createdAt) > thirtyDaysAgo
    }).map(deal => {
        return { name: deal.dealName, amount: parseFloat(deal.amount) }
    })


    useEffect(() => {
        countContacts()
        countDeals()
    }, [])

    const countContacts = (data) => {
        const resultArray = [];

        contacts.forEach(item => {
            // split the date string to get the required format
            const [year, month, day] = item.createdAt.split("T")[0].split("-");
            // concatenate year, month and day to get the desired date format
            const name = `${year}/${month}/${day}`;
            // Check if name exists in the result array
            const existingEntry = resultArray.findIndex(entry => entry.name === name);
            if (existingEntry === -1) {
                resultArray.push({
                    name: name,
                    count: 1
                });
            } else {
                // increment count
                resultArray[existingEntry].count++;
            }
        });
        setDate(resultArray);
    };

    // For deals
    const countDeals = (data) => {
        const resultArray = [];

        deals.forEach(item => {
            // split the date string to get the required format
            const [year, month, day] = item.closeDate.split("T")[0].split("-");
            // concatenate year, month and day to get the desired date format
            const name = `${year}/${month}/${day}`;
            // Check if name exists in the result array
            const existingEntry = resultArray.findIndex(entry => entry.name === name);
            if (existingEntry === -1) {
                resultArray.push({
                    name: name,
                    count: 1
                });
            } else {
                // increment count
                resultArray[existingEntry].count++;
            }
        });
        setCloseDate(resultArray);
    };


    return (
        <AccountLayout>
            <Meta title={`Vagabond - Modules | Dashboard`} />
            <Content.Title
                title="Customer Cloud"
                subtitle="Manage your Sales and Customer processes"
            />
            <Content.Divider />
            <Content.Container>

                <div className="mb-10">
                    <div className="">
                        <p className="text-lg text-gray-800 mt-2">Dashboard</p>
                        <p className="text-sm text-gray-400 ">My Overview</p>
                    </div>
                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                        {stats.map((item) => (
                            <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
                <p className="text-lg text-gray-800 mt-2">Stats</p>
                <div className="grid grid-cols-3 gap-4 border p-5 rounded-md bg-white shadow">
                    <div>
                        <p className="text-sm text-gray-400 mb-4">Deal Value</p>
                        <div className="-mx-10">
                            <ResponsiveContainer width="90%" height={150}>
                                <BarChart width={300} height={500} data={data} >
                                    <CartesianGrid strokeDasharray="3" stroke="#DFE2E6" />
                                    <XAxis dataKey="name" fontSize={0} stroke="#ffffff" />
                                    <YAxis stroke="#DFE2E6" fontSize={10} />
                                    <Tooltip />
                                    <Bar dataKey="amount" stackId="a" barSize={40} fill="#ff0000" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-4">Close Dates</p>
                        <div className="-mx-10">
                            <ResponsiveContainer width="90%" height={150}>
                                <BarChart width={300} height={500} data={closeDate} >
                                    <CartesianGrid strokeDasharray="3" stroke="#DFE2E6" />
                                    <XAxis dataKey="name" fontSize={10} stroke="#DFE2E6" />
                                    <YAxis stroke="#DFE2E6" fontSize={10} />
                                    <Tooltip />
                                    <Bar dataKey="count" stackId="a" barSize={40} fill="#ff0000" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div>
                            <p className="text-sm text-gray-400 mb-4">New Contacts</p>
                            <div className="-mx-10">
                                <ResponsiveContainer width="90%" height={160}>
                                    <LineChart data={date} margin={{ top: 15, right: 0, bottom: 15, left: 0 }}>
                                        <Tooltip />
                                        <XAxis dataKey="label" fontSize={0} stroke="#ffffff" />
                                        <YAxis stroke="#DFE2E6" fontSize={10} />
                                        <CartesianGrid strokeDasharray="3" stroke="#DFE2E6" />
                                        <Line type="monotone" dataKey="count" stroke="#FB8833" />
                                        <Line type="monotone" dataKey="leads" stroke="#17A8F5" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <p className="text-lg text-gray-800 mt-2">Upcoming Events</p>
                    <p className="text-sm text-gray-400 ">Deal Closes</p>
                </div>
                <Calendra deals={deals} />
                <div className="pt-10">
                    <p className="text-lg text-gray-800 mt-2">Overview</p>
                    <p className="text-sm text-gray-400 ">Module and Smart Contract information</p>
                </div>
                <div className="grid grid-cols-4 gap-4">
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
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/documents/${id}`}>
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

                                <Card.Body title="Filings" subtitle="">
                                    <div className="">
                                        <p className="text-xs ">Manage your Filings</p>
                                    </div>
                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contracts/${id}`}>
                            <div className="bg-stone-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">

                                <Card.Body title="Contracts" subtitle="">
                                    <div className="">
                                        <p className="text-xs ">Manage your Contracts</p>
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
                    <div className="my-2 hover:bg-gray-200 cursor-pointer">
                        <Card>
                            <Card.Body title="How to use contacts" subtitle="">
                                <p className="text-sm text-gray-400">Lorem Ipsum</p>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="my-2 hover:bg-gray-200 cursor-pointer">
                        <Card>
                            <Card.Body title="How to create deals" subtitle="">
                                <p className="text-sm text-gray-400">Lorem Ipsum</p>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="my-2 hover:bg-gray-200 cursor-pointer">
                        <Card>
                            <Card.Body title="How to fill settings" subtitle="">
                                <p className="text-sm text-gray-400">Lorem Ipsum</p>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="my-2 hover:bg-gray-200 cursor-pointer">
                        <Card>
                            <Card.Body title="How to use projects" subtitle="">
                                <p className="text-sm text-gray-400">Lorem Ipsum</p>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="my-2 hover:bg-gray-200 cursor-pointer">
                        <Card>
                            <Card.Body title="How to work with contracts" subtitle="">
                                <p className="text-sm text-gray-400">Lorem Ipsum</p>
                            </Card.Body>
                        </Card>
                    </div>

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

    const total = await calculateTotal(deals.filter((u) => u.dealOwnerId === session.user.userId))
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
            settings: JSON.stringify(settings),
            session: JSON.stringify(session),
        }
    }
}