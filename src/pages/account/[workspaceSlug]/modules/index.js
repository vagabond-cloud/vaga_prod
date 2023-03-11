import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import { items } from '@/config/modules/items';
import { AccountLayout } from '@/layouts/index';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}



function Modules() {
    const router = useRouter();
    const { workspaceSlug } = router.query;

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Modules | Dashboard`} />
            <Content.Title
                title="Create Module"
                subtitle="Modules overview and creation"
            />
            <Content.Divider />
            <Content.Container>
                <div className="mx-auto w-full">

                    <p className="text-lg text-gray-800">Create a new module for your workspace.</p>
                    <ul role="list" className="mt-6 divide-y divide-gray-200 border-t border-b border-gray-200">
                        {items.map((item, itemIdx) => (
                            <li key={itemIdx} className="hover:bg-gray-200">
                                <div className="group relative flex items-start space-x-3 py-4 ">
                                    <div className="flex-shrink-0 px-2">
                                        <span
                                            className={classNames(item.iconColor, 'inline-flex items-center justify-center h-10 w-10 rounded-lg')}
                                        >
                                            <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium text-gray-900">
                                            <Link href={`/account/${workspaceSlug}/modules/create/${item.href}`}>
                                                <span className="absolute inset-0" aria-hidden="true" />
                                                {item.name}
                                            </Link>
                                        </div>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </div>
                                    <div className="flex-shrink-0 self-center px-2">
                                        <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 flex">
                        <a href="#" className="text-sm font-medium text-red-600 hover:text-red-500">
                            Or start from an empty project
                            <span aria-hidden="true"> &rarr;</span>
                        </a>
                    </div>
                </div>
            </Content.Container>
        </AccountLayout >
    )
}

export default Modules