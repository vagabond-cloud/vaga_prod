import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef } from 'react'

import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import Button from '@/components/Button/index';
import SlideOver from '@/components/SlideOver';
import api from '@/lib/common/api';
import Modal from '@/components/Modal';

import { AccountLayout } from '@/layouts/index';
import { getProductPass } from '@/prisma/services/modules';
import { uploadToGCS } from '@/lib/client/upload';
import toast from 'react-hot-toast';
import Pagniation from '@/components/Pagination/';
import { getSubPasses } from '@/prisma/services/modules';
import moment from 'moment';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { generatePassid } from '@/lib/server/vid';
import { TicketIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function MaterialList({ pass, passes, total }) {
    const router = useRouter();
    const { workspaceSlug, id } = router.query;

    const tabs = [
        { name: 'Overview', href: '', current: false },
        { name: 'Images', href: 'images', current: false },
        { name: 'Documents', href: 'documents', current: false },
        { name: 'Material List', href: 'materiallist', current: false },
        { name: 'Report', href: 'report', current: false },
        { name: 'Passes', href: 'passes', current: true }
    ]

    const createPass = async (matid) => {
        const res = await api(`/api/modules/product-pass/subPass`, {
            method: 'POST',
            body: {
                workspaceid: pass.workspaceId,
                moduleid: pass.id,
                data: {
                    vid: pass.vid,
                    passid: generatePassid(),
                    pp_productPassid: pass.id,
                    tokenid: "1"
                }
            }
        })
        if (res.status === 200) {
            toast.success('Material Assigned')
            router.replace(router.asPath)
        } else {
            toast.error('Material could not be assigned')
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
                <div className="flex gap-4 justify-between">
                    <div className="text-md font-bold">
                        Sub Passes
                    </div>
                    <div className="">
                        <Button
                            className="bg-red-600 text-white hover:bg-red-500"
                            onClick={() => createPass()}
                        >
                            Add
                        </Button>
                    </div>
                </div>
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                ID
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                VID
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Token ID
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Created At
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {passes.map((pass, index) => (
                                            <tr key={index} className="hover:bg-gray-100">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 flex gap-2 items-center">
                                                    {pass.passid}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{pass.vid}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{pass.tokenid}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{moment(pass.createdAt).format("DD MMM. YYYY")}</td>

                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 flex justify-end text-right text-xs font-medium sm:pr-6">
                                                    <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/${pass.vid}/pass/${pass.passid}`} target="_blank" className="text-red-600 hover:text-red-900 mr-2 flex items-center mr-8">
                                                        <TicketIcon className="text-red-600 w-8 h-8 hover:text-red-400" />
                                                    </Link>
                                                    <Link href={`/account/${workspaceSlug}/modules/product-pass/dashboard/pass/card/${pass.vid}/pass/${pass.passid}`} className="text-red-600 hover:text-red-900 mr-2">
                                                        <Button className="bg-red-600 text-white hover:bg-red-500">Details</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {total > 10 &&
                    <Pagniation page={page} total={total} />
                }
            </Content.Container>
        </AccountLayout>
    );
}

export async function getServerSideProps(ctx) {
    const { page } = ctx.query

    const session = await getSession(ctx);

    const pass = await getProductPass(ctx.params.id);
    const passes = await getSubPasses(!page ? 1 : page, 10, { id: 'asc' }, pass.id)

    return {
        props: {
            pass: JSON.parse(JSON.stringify(pass)),
            passes: JSON.parse(JSON.stringify(passes.passes)),
            total: passes.total,
        }
    }
}
