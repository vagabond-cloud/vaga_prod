import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import Button from '@/components/Button/index';
import SlideOver from '@/components/SlideOver';
import api from '@/lib/common/api';

import { countries } from '@/config/common/countries';
import { materialStatus } from '@/config/modules/pass';
import { AccountLayout } from '@/layouts/index';
import { getMaterials, getModule } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useForm, Controller } from "react-hook-form";
import Pagniation from '@/components/Pagination/';
import generateVID from '@/lib/server/vid';
import { units } from '@/config/common/units';

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function Materials({ modules, materials, workspace, total }) {


    const router = useRouter();
    const { workspaceSlug, id, page } = router.query;

    const defaultValues = {
        vid: generateVID(),
        version: '',
        material: '',
        material_name: '',
        material_description: '',
        material_type: '',
        unit: '',
        material_nr: '',
        division: '',
        product_allocation: '',
        material_status: '',
        material_group: '',
        office: '',
        valid_from: '',
        item_group: '',
        auth_group: '',
        gross_weight: '',
        net_weight: '',
        unit_weight: '',
        volume: '',
        size: '',
        ean: '',
        packaging_material: '',
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => createContact(data);


    const createContact = async (data) => {

        try {
            const res = await api(`/api/modules/product-pass/material`, {
                method: 'POST',
                body: {
                    data,
                    workspaceid: workspace[0].id,
                    moduleid: modules.id
                }
            });

            if (res.status === 200) {
                writeLog();
                router.replace(router.asPath);
            } else {
                toast.error('Error creating Materials');
            }
        } catch (error) {
            toast.error(`Error creating Materials: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    const writeLog = async () => {
        toast.success('Materials created successfully')
    }

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Materials | Dashboard`} />
            <Content.Title
                title="Materials"
                subtitle="Overview of your Materials"
            />
            <Content.Divider />
            <Content.Container>
                <div className="mt-4">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-xl font-semibold text-gray-900">Materials</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                A list of all the Materials in your Workspace.
                            </p>
                        </div>
                        <SlideOver
                            title="Add Material"
                            subTitle="Add a new Material to your Product Pass"
                            buttonTitle="Add Material"
                        >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="overflow-scroll h-full pb-20">
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="version"
                                            id="version"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select label="Version" {...field}>
                                                    <option value="">Select Version</option>
                                                    <option value="1.0.0">1.0.0</option>
                                                    <option value="1.0.1">1.0.1</option>
                                                </Select>
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.salutation?.type === 'required' && <p role="alert">Version is required</p>}</div>

                                    </div>

                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="material"
                                                id="material"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Material *"
                                                        {...field}

                                                    />
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.material?.type === 'required' && <p role="alert">Material is required</p>}</div>

                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="material_name"
                                                id="material_name"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Material Name *"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.material_name?.type === 'required' && <p role="alert">Material Name is required</p>}</div>

                                        </div>
                                    </div>
                                    <div className="px-4 my-10">

                                        <div className="mt-1">
                                            <Controller
                                                name="material_description"
                                                id="material_description"
                                                control={control}
                                                render={({ field }) => (
                                                    <Textarea
                                                        label="Description"
                                                        rows={3}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="material_type"
                                                id="material_type"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Material Type"
                                                        type="text"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="unit"
                                                id="unit"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select label="Unit" {...field}>
                                                        <option value="">Select Unit</option>
                                                        {units.map((unit, index) => (
                                                            <option key={index} value={unit.id}>{unit.name}</option>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="material"
                                                id="material"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Material #"
                                                        type="text"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="division"
                                                id="division"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Division"
                                                        type="text"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="material_status"
                                                id="material_status"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select
                                                        label="Material Status"
                                                        {...field}
                                                    >
                                                        <option value="">Select Material Status</option>
                                                        {materialStatus.map((stage, index) =>
                                                            <option key={index} value={stage.id}>{stage.name}</option>
                                                        )}
                                                    </Select>
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.material_status?.type === 'required' && <p role="alert">Material Status is required</p>}</div>

                                        </div>

                                    </div>

                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="material_group"
                                                id="material_group"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Material Group"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="office"
                                                id="office"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Office"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="valid_from"
                                                id="valid_from"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Valid from"
                                                        type="date"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.valid_from?.type === 'required' && <p role="alert">Valid From is required</p>}</div>

                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="item_group"
                                                id="item_group"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Item Group"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="auth_group"
                                                id="auth_group"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Auth Group"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="gross_weight"
                                                id="gross_weight"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Gross Weight"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.gross_weight?.type === 'required' && <p role="alert">Gross Weight is required</p>}</div>

                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="net_weight"
                                                id="net_weight"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Net Weigth"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="unit_weight"
                                                id="unit_weight"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Unit Weight"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="volume"
                                                id="volume"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Volume"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="size"
                                                id="size"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Size"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="ean"
                                                id="ean"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="EAN/UPC"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="packaging_material"
                                                id="packaging_material"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Packaging Material"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="flex flex-shrink-0 justify-end px-4 py-4 w-full border-t absolute bottom-0 bg-white">
                                    <Button
                                        type="submit"
                                        className="ml-4 inline-flex justify-center  rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    // onClick={() => createContact()}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>

                        </SlideOver>
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
                                                    Material Status
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
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{materialStatus.find((m) => m.id === material.material_status)?.name}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{moment(material.valid_from).format("DD MMM. YYYY")}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{material.gross_weight} {units.find((u) => u.id === material.unit)?.name}</td>

                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                                                        <Link href={`/account/${workspaceSlug}/modules/product-pass/materials/card/${material.id}`} className="text-red-600 hover:text-red-900">
                                                            <ArrowRightCircleIcon className="w-6 hover:text-gray-800" />
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
                </div>
            </Content.Container>
        </AccountLayout >
    )
}

export default Materials


export async function getServerSideProps(context) {

    const { page } = context.query
    const session = await getSession(context);
    let isTeamOwner = false;
    let workspace = null;

    const modules = await getModule(context.params.id);
    const materials = await getMaterials(!page ? 1 : page, 10, { id: 'asc' }, modules.id)

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
    return {
        props: {
            isTeamOwner,
            workspace: JSON.parse(JSON.stringify(workspace)),
            modules: JSON.parse(JSON.stringify(modules)),
            materials: JSON.parse(JSON.stringify(materials.materials)),
            total: materials.total
        }
    }
}