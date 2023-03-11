import api from '@/lib/common/api';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { Controller, useForm } from "react-hook-form";

import Button from '@/components/Button/index';
import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import { AccountLayout } from '@/layouts/index';
import { uploadToGCS } from '@/lib/client/upload';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Company({ workspace, isTeamOwner, session }) {

    const router = useRouter()
    const { name, workspaceSlug } = router.query

    const documentsRef = useRef(null)

    const [url, setUrl] = useState('')
    const [upload, setUpload] = useState(false)

    const handleUpload = async (e) => {
        setUpload(true)
        const file = e.target.files[0];
        if (file.size > 10000000) return toast.error('File size is too large')

        const getDocument = await uploadToGCS(file)
        console.log(getDocument)
        setUrl(getDocument)
        setUpload(false)
    }

    const companyid = Math.random().toString(16).slice(2, 4).toUpperCase() +
        Math.random().toString(16).slice(2, 14).toUpperCase();

    const applicationid = Math.random().toString(16).slice(2, 4).toUpperCase() +
        Math.random().toString(16).slice(2, 14).toUpperCase();


    const defaultValues = {
        companyid: companyid,
        applicationid: applicationid,
        company_name: name,
        company_reg_number: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        account_type: "company",
        registration_country: '',
        registration_city: '',
        date_registered: new Date().getTime(),
        status: 'pending',
        workspace: workspaceSlug,
        workspaceid: workspace.id,
    }

    console.log(workspace)

    const { handleSubmit, control, setValue, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => createCompany(data);

    const createCompany = async (dataa) => {
        const data = {
            ...dataa,
            reg_doc: url
        }
        console.log(dataa)
        const res = await api(`/api/company`, {
            method: 'POST',
            body: {
                data
            }
        })
        if (res.status === 200) {
            toast.success('Company application submitted successfully')
            router.push(`/account/${workspaceSlug}`)
        } else {
            toast.error('An error occured')
        }
    }

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Company | Dashboard`} />
            <Content.Title
                title="Company"
                subtitle="Register your Company"
            />
            <Content.Divider />
            <Content.Container>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className=" h-full pb-20">
                            <p className="text-sm text-gray-500 px-4">We offer a hassle-free company registration process designed to help you start your jounrey quickly and easily. </p>
                            <div className="grid grid-cols-2 gap-4 mt-10">
                                <div className="px-4 my-0">
                                    <Controller
                                        name="company_name"
                                        id="company_name"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Company Name"
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                </div>
                                <div className="px-4 my-0">
                                    <Controller
                                        name="company_reg_number"
                                        id="company_reg_number"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Company Registration #"
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                </div>
                                <div className="px-4 my-0">
                                    <Controller
                                        name="contact_name"
                                        id="contact_name"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Contact Name"
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                </div>
                                <div className="px-4 my-0">
                                    <Controller
                                        name="contact_email"
                                        id="contact_email"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Contact Email"
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                </div>
                                <div className="px-4 my-0">
                                    <Controller
                                        name="contact_phone"
                                        id="contact_phone"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Contact Phone"
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                </div>
                                <div className="px-4 my-0">
                                    <Controller
                                        name="registration_country"
                                        id="registration_country"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Country"
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                </div>
                                <div className="px-4 my-0">
                                    <Controller
                                        name="registration_city"
                                        id="registration_city"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="City"
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.dealName?.type === 'required' && <p role="alert">Deal name is required</p>}</div>
                                </div>
                                {!url ?
                                    <div className="px-4 my-0 col-span-2">
                                        <div className="flex items-center justify-center w-full " onClick={() => documentsRef.current.click()}>
                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {upload ?
                                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#555" className="text-gray-400" xmlns="http://www.w3.org/2000/svg">
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
                                                        :
                                                        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                                    }
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Trade License</span> </p>
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, XLS, TXT (MAX. 10 MB)</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={documentsRef}
                                                    className="hidden"
                                                    onChange={(e) => handleUpload(e)}
                                                    accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.rtf,.mp4,.mov"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    :
                                    <div className="px-4 my-0 col-span-2">
                                        <div className="flex items-center justify-center w-full ">
                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg  bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                <CheckCircleIcon className="w-8 h-8 text-green-600" />
                                                <p className="my-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Successfully uploaded!</span> </p>

                                            </label>
                                        </div>
                                    </div>
                                }
                            </div>
                            {url &&
                                <div className="my-10 px-4 flex justify-end">
                                    <Button className="bg-red-600 text-white hover:bg-red-500">Send</Button>
                                </div>
                            }
                        </div>
                    </form>
                </div>
            </Content.Container>
        </AccountLayout>
    );
}


export async function getServerSideProps(context) {
    const { workspaceSlug } = context.params;

    const session = await getSession(context);
    let isTeamOwner = false;
    let workspace = null;

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

    const currentWorkspace = workspace.find((w) => w.slug === workspaceSlug);
    const member = currentWorkspace?.members.find((m) => m.email === session.user.email).inviter;
    const isOwner = currentWorkspace?.members.find((m) => m.email === session.user.email).teamRole === "OWNER";


    return {
        props: {
            isTeamOwner,
            session,
            workspace: JSON.parse(JSON.stringify(workspace[0]))
        },
    };
}
