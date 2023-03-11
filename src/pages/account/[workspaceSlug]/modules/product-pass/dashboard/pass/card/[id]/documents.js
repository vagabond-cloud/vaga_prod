import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

import Button from '@/components/Button/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import api from '@/lib/common/api';

import { AccountLayout } from '@/layouts/index';
import { uploadToGCS } from '@/lib/client/upload';
import { getProductPass } from '@/prisma/services/modules';
import toast from 'react-hot-toast';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Images({ pass, docs }) {
    const router = useRouter();
    const { workspaceSlug, id } = router.query;
    const documentsRef = useRef(null)

    const [image, setImage] = useState(null);
    const [inputFile, setFile] = useState(null);
    const [fileType, setType] = useState(null);
    const [fileSize, setSize] = useState(null);
    const [fileName, setName] = useState(null);
    const [submit, setSubmit] = useState(false);

    const tabs = [
        { name: 'Overview', href: '', current: false },
        { name: 'Images', href: 'images', current: false },
        { name: 'Documents', href: 'documents', current: true },
        { name: 'Material List', href: 'materiallist', current: false },
        { name: 'Report', href: 'report', current: false },
        { name: 'Passes', href: 'passes', current: false }
    ]

    const handleUpload = (e, type) => {

        const file = e.target.files[0];
        const imgurl = URL.createObjectURL(file)
        setFile(file)
        setImage(imgurl)
        setType(file.type)
        setSize(file.size)
        setName(file.name)
    }

    const uploadDocument = async () => {
        setSubmit(true)
        const getDocument = await uploadToGCS(inputFile)
        const res = await api(`/api/modules/product-pass/passDocuments`, {
            method: 'POST',
            body: {
                data: {
                    pp_productPassid: pass.id,
                    url: getDocument,
                    vid: pass.vid,
                },
                type: fileType,
                size: fileSize,
                name: fileName,
                workspaceid: pass.workspaceid,
                moduleid: pass.moduleid,

            }
        })
        setSubmit(false)
        if (res.status === 200) {
            toast.success('Document uploaded successfully');
            setImage(null)
            setFile(null)
            router.replace(router.asPath)
        } else {
            toast.error('Something went wrong');
        }
    }

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Product Pass | Dashboard`} />
            <Content.Title
                title="Product Pass"
                subtitle="Overview of your Product Pass"
            />
            <Content.Divider />
            <Content.Container>
                <div className="my-6 sm:mt-2 2xl:mt-5">
                    <div className=" border-gray-200">
                        <div className="mx-auto max-w-full px-0 sm:px-6 lg:px-0">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {tabs.map((tab) => (
                                    <Link
                                        key={tab.name}
                                        href={`/account/${workspaceSlug}/modules/product-pass/dashboard/pass/card/${id}/${tab.href}`}
                                        className={classNames(
                                            tab.current
                                                ? 'border-red-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                        )}
                                        aria-current={tab.current ? 'page' : undefined}
                                    >
                                        {tab.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="">
                    {image ?
                        <>
                            <div className="h-64 flex justify-center overflow-hidden">
                                <div className="bg-gray-200 p-10 rounded-lg my-10">
                                    <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{inputFile.name}</p>
                                    <p className="pointer-events-none block text-sm font-medium text-gray-500">{parseFloat(inputFile.size / 1000000).toFixed(2)} MB</p>
                                    <p className="pointer-events-none block text-sm font-medium text-gray-500">{inputFile.type}</p>
                                </div>
                            </div>
                            <div className="flex justify-center w-full">
                                {!submit ?
                                    <Button className="bg-red-600 text-white" onClick={() => uploadDocument()}>
                                        Upload
                                    </Button>
                                    :
                                    <Button className="bg-red-600 text-white">
                                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                    </Button>
                                }
                            </div>
                        </>
                        :
                        <div className="flex items-center justify-center w-full" onClick={() => documentsRef.current.click()}>
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, XLS, TXT (MAX. 10 MB)</p>
                                </div>
                                <input
                                    type="file"
                                    ref={documentsRef}
                                    className="hidden"
                                    onChange={(e) => handleUpload(e, 'image')}
                                    accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.rtf,.mp4,.mov"
                                />
                            </label>
                        </div>
                    }
                </div>
                <div className="border-t py-10">
                    <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                        {docs?.map((file, index) => (
                            <li key={index} className="relative">
                                <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                    {file.type === 'application/pdf' &&
                                        <img src="/images/pdf.png" alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                    }
                                    {file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
                                        <img src="/images/doc.png" alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                    }
                                    {file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
                                        <img src="/images/xls.png" alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                    }
                                    {file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
                                        <img src="/images/ppt.png" alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                    }

                                    <button type="button" className="absolute inset-0 focus:outline-none">
                                        <span className="sr-only">View details for {file.name}</span>
                                    </button>
                                </div>
                                <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="pointer-events-none block text-sm font-medium text-gray-500">{parseFloat(file.size / 1000000).toFixed(2)} MB</p>
                                <p className="pointer-events-none block text-sm font-medium text-gray-500">{file.type}</p>

                            </li>
                        ))}
                    </ul>
                </div>
            </Content.Container>
        </AccountLayout>
    );
}

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);

    const pass = await getProductPass(ctx.params.id);
    const docs = pass.pp_productDocuments


    return {
        props: {
            pass: JSON.parse(JSON.stringify(pass)),
            docs: JSON.parse(JSON.stringify(docs ? docs : []))
        }
    }
}
