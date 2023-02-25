import Image from 'next/image'
import Link from 'next/link'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid'
import useSign from '@/hooks/data/useSign';
import { useRouter } from 'next/router'

export default function Gateway({ image, session, expried }) {
    const router = useRouter()
    const { id } = router.query
    const { data, isLoading } = useSign(id);

    const setType = (type) => {
        if (type === "signin") {
            return `Waiting for you to scan and verify the sign in request for ${session.account} with the VagaWallet app.`
        }
    }

    return (
        <div className="bg-white">
            {/* Background color split screen for large screens */}
            <div className="fixed top-0 left-0 hidden h-full w-1/2 bg-white lg:block" aria-hidden="true" />
            <div className="fixed top-0 right-0 hidden h-full w-1/2 bg-red-600 lg:block" aria-hidden="true" />

            <header className="relative mx-auto max-w-7xl bg-white py-6 xs:px-4 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:bg-transparent lg:px-8 lg:pt-16 lg:pb-10">
                <Link href="/account">
                    <Image src="/android-chrome-192x192.png" alt="VagaWallet" width={50} height={50} className="mx-0" />
                </Link>
            </header>

            <main className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8">
                {isLoading ?
                    <div className="">
                        Loading...
                    </div>
                    :
                    <>
                        <section>
                            <div className="max-w-2xl px-4 lg:w-full lg:max-w-lg lg:px-0 mt-10">
                                <p className="text-lg font-bold px-0">Scan this QR with VagaWallet</p>

                                <div className={`py-6 shadow-xl rounded-xl mx-auto ${!image ? "h-[400px]" : "min-h-[400px]"}`}>
                                    <div className="bg-gray-800 h-10 w-full flex items-center px-4">
                                        <p className="text-gray-100 text-sm">
                                            Sign request
                                        </p>
                                    </div>
                                    {session.expiresAt < new Date().getTime() ?
                                        <div className="h-full mt-20 flex items-center mx-auto ">
                                            <ClockIcon className="h-40 w-40 text-red-600 mx-auto" aria-hidden="true" />

                                        </div>
                                        :
                                        <div className="h-full flex items-center">
                                            {!data ?
                                                <Image src={image} alt="QR Code" width={400} height={400} className="mx-auto" />
                                                :
                                                <div className="h-full mx-auto mt-20">
                                                    <CheckCircleIcon className="h-40 w-40 text-green-600 mx-auto" aria-hidden="true" />
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                                <div className="mt-10">
                                    <p className="text-sm text-center">Details will be available in the VagaWallet app after scanning the QR code.</p>
                                </div>
                            </div>

                        </section>
                        <section
                            className="bg-red-600 pt-6 pb-12 mt-10 text-red-600 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto xs:px-4 lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-24"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <p className="text-gray-50 text-lg font-bold mb-10">
                                        {typeLabel.find((t) => t.type === session?.type)?.label}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-50">
                                        {session?.type === "signin" ? session.account : session?.to}
                                    </p>
                                </div>
                                <div className="mt-10">
                                    <p className="text-gray-50 ">
                                        Node:
                                    </p>
                                </div>

                                <div className="mt-10">
                                    <p className="text-gray-50 ">
                                        {session?.node}
                                    </p>
                                </div>
                                <div className="">
                                    <p className="text-gray-50 ">
                                        Memo:
                                    </p>
                                </div>

                                <div className="">
                                    <p className="text-gray-50  mb-10">
                                        {session?.memo}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-20">
                                {!data && session.expiresAt > new Date().getTime() ?
                                    <div className="flex  gap-4 items-center">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#ffffff" className="text-gray-50" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="4" cy="12" r="3" >
                                                <animate id="spinner_jObz" begin="0;spinner_vwSQ.end-0.25s" attributeName="r" dur="0.75s" values="3;.2;3" />
                                            </circle>
                                            <circle cx="12" cy="12" r="3">
                                                <animate begin="spinner_jObz.end-0.6s" attributeName="r" dur="0.75s" values="3;.2;3" />
                                            </circle>
                                            <circle cx="20" cy="12" r="3">
                                                <animate id="spinner_vwSQ" begin="spinner_jObz.end-0.45s" attributeName="r" dur="0.75s" values="3;.2;3" />
                                            </circle>
                                        </svg>
                                        <p className="text-gray-50">{setType(session?.type)}</p>
                                    </div>
                                    :
                                    <div className="flex gap-4 items-center">
                                        <p className="text-gray-50">Request is expired.</p>
                                    </div>
                                }
                            </div>
                        </section>
                    </>
                }
            </main>
        </div >
    )
}


const typeLabel = [{
    type: 'signin',
    label: 'Sign in'
},
{
    type: 'payment',
    label: 'Payment'
},]