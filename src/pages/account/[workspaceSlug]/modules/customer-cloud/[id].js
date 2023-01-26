import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import { AccountLayout } from '@/layouts/index';
import Link from 'next/link';
import { useRouter } from 'next/router';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function CustomerCloud() {
    const router = useRouter();
    const { workspaceSlug, id } = router.query;

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Modules | Dashboard`} />
            <Content.Title
                title="Customer Cloud"
                subtitle="Manage your Sales and Customer processes"
            />
            <Content.Divider />
            <Content.Container>
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
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/projects/${id}`}>
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