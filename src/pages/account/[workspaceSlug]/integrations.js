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
            <Meta title={`Vagabond - Integrations | Dashboard`} />
            <Content.Title
                title="Integrations"
                subtitle="Available Integrations "
            />
            <Content.Divider />
            <Content.Container>
                <div className="">
                    <p className="text-lg text-gray-800 mt-2">Overview</p>
                    <p className="text-sm text-gray-400 ">Integrations can be added to all modules  </p>
                </div>
                <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                    {files.map((file) => (
                        <li key={file.source} className="relative">
                            <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img src={file.source} alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                <button type="button" className="absolute inset-0 focus:outline-none">
                                    <span className="sr-only">View details for {file.title}</span>
                                </button>
                            </div>
                            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{file.title}</p>
                            <p className="pointer-events-none block text-sm font-medium text-gray-500">{file.size}</p>
                        </li>
                    ))}
                </ul>

            </Content.Container>
        </AccountLayout >
    )
}

export default CustomerCloud


const files = [
    {
        title: 'AI Support',
        size: parseFloat('200,00').toLocaleString("de-DE", { style: "currency", currency: "EUR" }),
        repeat: "monthly",
        source:
            'https://images.unsplash.com/photo-1655635643486-a17bc48771ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80',
    },
    {
        title: 'Carbon Footprint',
        size: parseFloat('99,00').toLocaleString("de-DE", { style: "currency", currency: "EUR" }),
        repeat: "monthly",
        source:
            'https://images.unsplash.com/photo-1529773464063-f6810c569277?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
    },
    {
        title: 'Reporting',
        size: parseFloat('399,00').toLocaleString("de-DE", { style: "currency", currency: "EUR" }),
        repeat: "monthly",
        source:
            'https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2348&q=80',
    },
    {
        title: 'Chatbot',
        size: parseFloat('99,00').toLocaleString("de-DE", { style: "currency", currency: "EUR" }),
        repeat: "monthly",
        source:
            'https://images.unsplash.com/photo-1530811761207-8d9d22f0a141?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    },
    // More files...
]