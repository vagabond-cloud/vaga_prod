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
                title="AI-Cloud"
                subtitle="Use Vagabonds powerful AI Engine "
            />
            <Content.Divider />
            <Content.Container>
                <div className="">
                    <p className="text-lg text-gray-800 mt-2">Overview</p>
                    <p className="text-sm text-gray-400 ">Choose your use case</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/contacts/${id}`}>
                            <div className="bg-teal-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="Managed Assistant" subtitle="">

                                    <p className="text-xs ">Vagabond Service Assistant</p>

                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/ai-cloud/chat/${id}`}>
                            <div className="bg-green-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="Chat" subtitle="">

                                    <p className="text-xs ">Start a conversation</p>

                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/companies/${id}`}>
                            <div className="bg-sky-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="Reports" subtitle="">

                                    <p className="text-xs ">Create Reports instantly</p>

                                </Card.Body>
                            </div>
                        </Link>
                    </Card>
                    <Card>
                        <Link href={`/account/${workspaceSlug}/modules/customer-cloud/companies/${id}`}>
                            <div className="bg-gray-500 hover:bg-gray-200 text-gray-100 hover:text-gray-800 cursor-pointer">
                                <Card.Body title="Settings" subtitle="">

                                    <p className="text-xs ">Manage your AI</p>

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
                        <Card.Body title="How to use Vaga AI" subtitle="">
                            <p className="text-sm text-gray-400">Lorem Ipsum</p>
                        </Card.Body>
                    </Card>
                </div>
            </Content.Container>
        </AccountLayout >
    )
}

export default CustomerCloud