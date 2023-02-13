import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import Link from 'next/link'

function Pagination({ page, total }) {
    page = page || 1;
    const router = useRouter();
    const { workspaceSlug, id } = router.query;

    const currentPage = page;

    const totalPages = Math.ceil(total / 10);

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const adjacentPages = pages.length;
    const start = Math.max(currentPage - adjacentPages, 0);
    const end = Math.max(currentPage + adjacentPages, totalPages);

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <a
                    href="#"
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Previous
                </a>
                <a
                    href="#"
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Next
                </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{page === 1 ? "1" : (page - 1) * 10}</span> to <span className="font-medium">{currentPage * 10 > total ? total : currentPage * 10}</span> of{' '}
                        <span className="font-medium">{total}</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <Link
                            href={page === 1 ? "#" : `/account/${workspaceSlug}/modules/customer-cloud/documents/${id}?page=${currentPage - 1}`}
                            className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </Link>
                        {/* Current: "z-10 bg-red-50 border-red-500 text-red-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
                        {pages.slice(start, end).map((page, index) => (
                            <Link
                                href={`/account/${workspaceSlug}/modules/customer-cloud/documents/${id}?page=${page}`}
                                aria-current="page"
                                className={parseInt(page) === parseInt(currentPage) ? `relative z-10 inline-flex items-center border border-red-500 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 focus:z-20` : `relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20`}
                                key={index}
                            >
                                {page}
                            </Link>
                        ))}
                        <Link
                            href={parseInt(page) + 1 > totalPages ? "#" : `/account/${workspaceSlug}/modules/customer-cloud/documents/${id}?page=${parseInt(page) + 1}`}
                            className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </Link>
                    </nav>
                </div>
            </div>
        </div >
    )
};

export default Pagination;