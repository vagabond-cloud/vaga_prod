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
import { getProductPass, getMaterial } from '@/prisma/services/modules';
import { uploadToGCS } from '@/lib/client/upload';
import toast from 'react-hot-toast';
import Pagniation from '@/components/Pagination/';
import moment from 'moment';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function MaterialList({ pass, materials }) {
    const router = useRouter();
    const { workspaceSlug, id } = router.query;

    const [response, setResponse] = useState(null)
    const [submit, setSubmit] = useState(false)

    const tabs = [
        { name: 'Overview', href: '', current: false },
        { name: 'Images', href: 'images', current: false },
        { name: 'Documents', href: 'documents', current: false },
        { name: 'Material List', href: 'materiallist', current: false },
        { name: 'Report', href: 'report', current: true },
        { name: 'Passes', href: 'passes', current: false }

    ]

    const aiPrompt = async (prompt) => {
        setSubmit(true)

        const res = await api(`/api/ai`, {
            method: 'POST',
            body: {
                prompt
            }
        })
        setResponse(res.data?.choices[0]?.text)
        setSubmit(false)
    }

    const material_list = materials.map((material) => {
        return material.material
    })

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

                <div>
                    <div>
                        {submit ?
                            <div className="bg-red-600 text-white px-4 py-2 rounded-md">Loading...</div>
                            :
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-md"
                                onClick={() => aiPrompt(`create a German Sustainability Code report for ${pass.product_name} by ${pass.brand} using following materials: ${material_list.map((i) => i)}.It is produced in ${pass.country_origin} `)}
                            >
                                Create Report
                            </button>
                        }
                    </div>
                    {response &&
                        <div className="mt-10 p-10 rounded-lg bg-gray-800 text-gray-50">
                            <p className="text-sm">German Sustainability Code for {pass.product_name}</p>
                            <div className="text-2xl font-bold my-4">{pass.product_name}</div>
                            <div>{response?.split('\n').map((str, index) => <p className={`my-4 text-sm`} key={index}>{str}</p>)}</div>
                        </div>
                    }
                </div>
            </Content.Container>
        </AccountLayout>
    );
}

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);

    const pass = await getProductPass(ctx.params.id);

    const materials = await Promise.all(
        pass.pp_assignedMaterial.map((material) => (
            getMaterial(material.pp_materialsid)
                .then((res) => {
                    return res
                })
        ))
    );

    return {
        props: {
            pass: JSON.parse(JSON.stringify(pass)),
            materials: JSON.parse(JSON.stringify(materials)),
        }
    }
}
