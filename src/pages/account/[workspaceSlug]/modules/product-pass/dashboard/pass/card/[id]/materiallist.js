import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Button from '@/components/Button/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import api from '@/lib/common/api';

import Pagniation from '@/components/Pagination/';
import { AccountLayout } from '@/layouts/index';
import { getMaterials, getProductPass } from '@/prisma/services/modules';
import moment from 'moment';
import toast from 'react-hot-toast';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function MaterialList({ pass, materials, total, matList }) {
    const router = useRouter();
    const { workspaceSlug, id } = router.query;


    const tabs = [
        { name: 'Overview', href: '', current: false },
        { name: 'Images', href: 'images', current: false },
        { name: 'Documents', href: 'documents', current: false },
        { name: 'Material List', href: 'materiallist', current: true },
        { name: 'Report', href: 'report', current: false },
        { name: 'Passes', href: 'passes', current: false }

    ]

    const deleteMat = async (matid) => {
        console.log(matid)
        const res = await api(`/api/modules/product-pass/assignMat`, {
            method: 'DELETE',
            body: {
                id: matid
            }
        })
        if (res.status === 200) {
            toast.success('Material Deleted')
            router.replace(router.asPath)
        } else {
            toast.error('Material could not be deleted')
        }
    }


    const assignMat = async (matid) => {
        const res = await api(`/api/modules/product-pass/assignMat`, {
            method: 'POST',
            body: {
                workspaceid: pass.workspaceId,
                moduleid: pass.id,
                data: {
                    pp_productPassid: pass.id,
                    pp_materialsid: matid,
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
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Material
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Material #
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Valid from
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Gross Weight
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {materials.map((material, index) => (
                                            <tr key={index} className="hover:bg-gray-100">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 flex gap-2 items-center">
                                                    {material.material_name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{material.material_nr}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{moment(material.valid_from).format("DD MMM. YYYY")}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{material.id}</td>

                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 flex justify-end text-right text-xs font-medium sm:pr-6">
                                                    {matList.filter((item) => item.pp_materialsid === material.id).length > 0 ?
                                                        <Button className="bg-red-600 text-white hover:bg-red-500" onClick={() => deleteMat(matList.find((item) => item.pp_materialsid === material.id)?.id)}>Remove</Button>
                                                        :
                                                        <Button className="bg-red-600 text-white hover:bg-red-500" onClick={() => assignMat(material.id)}>Add</Button>
                                                    }
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
    const materials = await getMaterials(!page ? 1 : page, 10, { id: 'asc' }, pass.moduleid)

    return {
        props: {
            pass: JSON.parse(JSON.stringify(pass)),
            materials: JSON.parse(JSON.stringify(materials.materials)),
            total: materials.total,
            matList: pass.pp_assignedMaterial.length > 0 ? JSON.parse(JSON.stringify(pass.pp_assignedMaterial)) : [],
        }
    }
}
