import Button from '@/components/Button'
import Input from '@/components/Input'
import SlideOver from '@/components/SlideOver'
import { fileType } from '@/config/common/fileType'
import { contactActivity } from '@/lib/client/log'
import { uploadToGCS } from '@/lib/client/upload'
import api from '@/lib/common/api'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { Controller, useForm } from "react-hook-form"
import toast from 'react-hot-toast'

function Documents({ company, documents, deal }) {

    documents = JSON.parse(documents ? documents : '[]')
    const router = useRouter()
    const { workspaceSlug, id } = router.query
    const documentsRef = useRef(null)
    const [submit, setSubmit] = useState(false)
    const [list, setList] = useState(true)
    const [docs, setDocs] = useState(documents)
    const [keyword, setKeyword] = useState('')
    const [uploaded, setUploaded] = useState(false)


    const defaultValues = {
        file: '',
        title: '',
        documentUrl: '',
        companyId: id,
        fileSize: '',
        type: '',
        lastModified: '',
    }

    const { register, setValue, getValues, watch, handleSubmit, control, formState: { errors, touchedFields } } = useForm({ defaultValues });
    const onSubmit = data => updateDocument(data);

    const updateDocument = async (formInput) => {
        try {
            const res = await api(`/api/modules/document`, {
                method: 'PUT',
                body: {
                    id,
                    formInput,
                    workspaceId: deal.workspaceId,
                    moduleid: deal.moduleid,
                }
            });

            if (res.status === 200) {
                await writeLog("Document Uploaded", "document_uploaded", new Date(), id);
                router.replace(router.asPath);
                toast.success('Document uploaded successfully');
            } else {
                throw new Error();
            }
        } catch (err) {
            toast.error('Document upload failed');
        }
    };

    const uploadDocument = async (file) => {
        setSubmit(true)
        const getDocument = await uploadToGCS(file)
        setValue("documentUrl", getDocument)
        setValue("fileSize", file.size)
        setValue("type", file.type)
        setValue("lastModified", file.lastModified)
        setSubmit(false)
        setUploaded(true)
    }

    const searchDocuments = async (e) => {
        if (!e) return;
        setDocs([])
        const search = await api(`/api/modules/customer-cloud/searchDocuments`, {
            method: 'POST',
            body: {
                id: id,
                title: keyword,
                type: keyword
            }
        })
        if (search.status === 200) {
            setDocs(search.documents)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            searchDocuments(event)
        }
    }

    return (

        <div className="w-full">

            <div className="">
                <div className="flex gap-4 items-center">
                    <Input type="text" placeholder="Search" className="-ml-4 sm:w-96 xs:w-60" onKeyDown={handleKeyDown} onChange={(e) => setKeyword(e.target.value)} />
                    <Button className="bg-red-600 text-white" onClick={searchDocuments}>Search</Button>
                </div>
                <div className="flex w-1/2 gap-4 cursor-pointer">
                    <div className="mt-6" onClick={() => setList(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" className="bi bi-card-list" viewBox="0 0 16 16">
                            <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                            <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                        </svg>
                    </div>
                    <div className="mt-6" onClick={() => setList(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-grid" viewBox="0 0 16 16">
                            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                        </svg>
                    </div>
                </div>
                <div className="flex w-full px-0 justify-end">
                    <SlideOver
                        buttonTitle=<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /></svg>
                        title="Add Document"
                        subTitle="Upload Documents"
                        state={false}
                    >
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className=" h-auto pb-20">
                                <div className="px-4 my-6">
                                    <div className="px-4 my-0 col-span-2">
                                        <Controller
                                            name="title"
                                            id="title"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="Title"
                                                    type="text"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="px-4 my-0 col-span-2">{errors.title && <span className="text-red-500 text-xs">This field is required</span>}</div>
                                </div>
                                <div className="px-4 my-6 flex justify-between mt-10">
                                    <div className="px-4 my-0 col-span-2">
                                        <Controller
                                            name="file"
                                            id="file"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label="File"
                                                    type="file"
                                                    onChange={(e) => {
                                                        field.onChange(e),
                                                            uploadDocument(e.target.files[0])
                                                    }}
                                                    ref={documentsRef}
                                                    accept=".jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.rtf,.mp4,.mov"
                                                />
                                            )}
                                        />
                                    </div>
                                    {submit &&
                                        <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-400" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="4" cy="12" r="3">
                                                <animate id="spinner_jObz" begin="0;spinner_vwSQ.end-0.25s" attributeName="r" dur="0.75s" values="3;.2;3" />
                                            </circle>
                                            <circle cx="12" cy="12" r="3">
                                                <animate begin="spinner_jObz.end-0.6s" attributeName="r" dur="0.75s" values="3;.2;3" />
                                            </circle>
                                            <circle cx="20" cy="12" r="3">
                                                <animate id="spinner_vwSQ" begin="spinner_jObz.end-0.45s" attributeName="r" dur="0.75s" values="3;.2;3" />
                                            </circle>
                                        </svg>
                                    }
                                    {uploaded &&
                                        <p className="text-xs text-gray-500 mt-2 px-2">Uploaded</p>
                                    }
                                </div>
                            </div>
                            {uploaded &&
                                <>
                                    <p className="px-8 my-2 text-sm font-bold">File Details</p>
                                    <div className="px-8 my-2 bg-gray-100 py-6 border">
                                        <div className="mt-2 grid grid-cols-3">
                                            <p className="text-sm">Title:</p>
                                            <p className="text-sm">{getValues("title")}</p>
                                        </div>
                                        <div className="mt-2 grid grid-cols-3">
                                            <p className="text-sm">Type:</p>
                                            <p className="text-sm">{getValues("type")}</p>
                                        </div>
                                        <div className="mt-2 grid grid-cols-3">
                                            <p className="text-sm">Size:</p>
                                            <p className="text-sm">{getValues("fileSize")}</p>
                                        </div>
                                        <div className="mt-2 grid grid-cols-3">
                                            <p className="text-sm">Last Modified:</p>
                                            <p className="text-sm">{moment(getValues("lastModified")).format("DD MMM. YYYY - hh:mm:ss")}</p>
                                        </div>
                                    </div>
                                </>
                            }
                            <div className="flex flex-shrink-0 min-h-20 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white resize-y">
                                {uploaded ?
                                    <Button
                                        type="submit"
                                        className="ml-4 inline-flex text-white justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white5shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Save
                                    </Button>
                                    :
                                    <></>
                                }
                            </div>
                        </form>
                    </SlideOver>
                </div>
            </div >
            <div className="flex flex-col">
                {list ?
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                                            >
                                                Name
                                            </th>
                                            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                                                Type
                                            </th>
                                            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                                                Size
                                            </th>
                                            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                                                Last modified
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {docs.map((item, index) => (
                                            <tr key={index}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                                                    <a href={item.documentUrl} target="_blank" rel="noreferrer">
                                                        {item.title}
                                                    </a>
                                                </td>
                                                <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                                    {(item.size / 1000000).toLocaleString()} MB
                                                </td>
                                                <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                                    {fileType.find((f) => f.type === item.type)?.name}
                                                </td>
                                                <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                                    {moment(item.lastModified).format("DD MMM. YYYY - hh:mm:ss")}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
                                                    <a href={item.documentUrl} target="_blank" rel="noreferrer">
                                                        <ArrowTopRightOnSquareIcon className="w-4 hover:text-gray-800" />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                    :
                    <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                        {docs.map((item, index) => (
                            <a key={index} href={item.documentUrl} target="_blank" rel="noreferrer">
                                <li className="relative">
                                    <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 hover:bg-gray-200 focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                        <div className="flex items-center justify-center">{fileType.find((f) => f.type === item.type)?.icon}</div>

                                        <button type="button" className="absolute inset-0 focus:outline-none">
                                            <span className="sr-only">View details for {item.title}</span>
                                        </button>
                                    </div>
                                    <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{item.title}</p>
                                    <p className="pointer-events-none block text-sm font-medium text-gray-500">{moment(item.createdAt).format("DD MMM. YYYY - HH:mm:ss")}</p>
                                    <p className="pointer-events-none block text-sm font-medium text-gray-500">{item.size / 1000000} MB</p>

                                </li>
                            </a>
                        ))}
                    </ul>
                }
            </div >
        </div >
    )
}

export default Documents


const writeLog = async (type, action, date, contactId) => {
    const res = await contactActivity(`${type}`, `${type} at ${date}`, `${action.toLowerCase()}`, '127.0.0.1', contactId);
}