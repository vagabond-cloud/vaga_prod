import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Button from '@/components/Button/index';
import Input from '@/components/Input/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import api from '@/lib/common/api';

import Pagniation from '@/components/Pagination/';
import { AccountLayout } from '@/layouts/index';
import { generatePassid } from '@/lib/server/vid';
import { getProductPass, getSubPasses } from '@/prisma/services/modules';
import { TicketIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import { useState } from 'react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function MaterialList({ pass, passes, total }) {
    const router = useRouter();
    const { workspaceSlug, id } = router.query;

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [ean, setEan] = useState('');
    const [quantity, setQuantity] = useState(0);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    const tabs = [
        { name: 'Overview', href: '', current: false },
        { name: 'Images', href: 'images', current: false },
        { name: 'Documents', href: 'documents', current: false },
        { name: 'Material List', href: 'materiallist', current: false },
        { name: 'Report', href: 'report', current: false },
        { name: 'Passes', href: 'passes', current: true }
    ]

    const createPass = async () => {

        const res = await api(`/api/modules/product-pass/subPass`, {
            method: 'POST',
            body: {
                workspaceid: pass.workspaceId,
                moduleid: pass.moduleid,
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

    const mintPass = async (data) => {
        const res = await api(`/api/modules/product-pass/mintPass`, {
            method: 'POST',
            body: {
                meta: {
                    name,
                    description,
                    ean,
                    quantity,
                    product_name: pass.product_name,
                    parent_organization: pass.parent_organization,
                    brand: pass.brand,
                    id_type_value: pass.id_type_value,
                    id_material_value: pass.id_material_value,
                    id_location_value: pass.id_location_value
                },
                location: location,
                contractAddress: pass.contractAddress,
            }
        });
        console.log(res)
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
                            onClick={() => toggleModal()}
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
                                                    <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/${pass.vid} /pass/${pass.passid}`} target="_blank" className="text-red-600 hover:text-red-900 mr-2 flex items-center mr-8">
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

                <Modal show={showModal} title="Add Pass" toggle={toggleModal}>
                    <div className="w-96 text-sm text-gray-400">
                        Mint a Product to your master Pass. This will create a new Pass and assign it to your master Pass with a unique pass ID.
                        This information will be used to verify the authenticity of the Pass and are publicly available.
                    </div>
                    <div className="text-sm mt-8 flex gap-4">
                        <p className="text-xs">VID:</p>
                        <p className="text-xs">{pass.vid}</p>
                    </div>
                    <div className="text-xs flex gap-4">
                        <p className="text-xs">Contract:</p>
                        <p className="truncate w-96 text-xs">{pass.contractAddress}</p>
                    </div>
                    <div className="text-sm mt-2">
                        <Input className="w-full" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="text-sm mt-2">
                        <Input className="w-full" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="text-sm mt-2">
                        <Input className="w-full" placeholder="Location" onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div className="text-sm mt-2">
                        <Input className="w-full" placeholder="EAN" onChange={(e) => setEan(e.target.value)} />
                    </div>
                    <div className="text-sm mt-2">
                        <Input className="w-full" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
                    </div>
                    <Button className="bg-red-600 text-white hover:bg-red-500" onClick={() => mintPass()}>Create Pass</Button>
                </Modal>
            </Content.Container>
        </AccountLayout >
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
