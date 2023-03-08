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

import { AccountLayout } from '@/layouts/index';
import { materialStatus } from '@/config/modules/pass';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useForm, Controller } from "react-hook-form";

import { getMaterial } from '@/prisma/services/modules';
import { units } from '@/config/common/units';

export default function MaterialDetails({ material }) {
    const router = useRouter();
    const { workspaceSlug, id } = router.query;

    const defaultValues = {
        vid: material.vid || '',
        version: material.version || '',
        material: material.material || '',
        material_name: material.material_name || '',
        material_description: material.material_description || '',
        material_type: material.material_type || '',
        unit: material.unit || '',
        material_nr: material.material_nr || '',
        division: material.division || '',
        product_allocation: material.product_allocation || '',
        material_status: material.material_status || '',
        material_group: material.material_group || '',
        office: material.office || '',
        valid_from: material.valid_from || '',
        item_group: material.item_group || '',
        auth_group: material.auth_group || '',
        gross_weight: material.gross_weight || '',
        net_weight: material.net_weight || '',
        unit_weight: material.unit_weight || '',
        volume: material.volume || '',
        size: material.size || '',
        ean: material.ean || '',
        packaging_material: material.packaging_material || '',
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => updateMaterial(data);

    const updateMaterial = async (data) => {

        const res = await api(`/api/modules/product-pass/material`, {
            method: 'PUT',
            body: {
                id: material.id,
                data
            }
        })
        if (res.status === 200) {
            toast.success('Material updated successfully');
            router.replace(router.asPath)
        } else {
            toast.error('Something went wrong');
        }
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
                <div>
                    <div className="justify-between mt-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">

                        <div>
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Material Information</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details for selected Material</p>
                        </div>
                        <SlideOver
                            title="Edit Material"
                            subTitle="Edit Material for your Product Pass"
                            buttonTitle="Edit Material"
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
                                                        {...field}
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
                                                name="material_nr"
                                                id="material_nr"
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
                                                name="product_allocation"
                                                id="product_allocation"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Product Allocation"
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
                    <div className="mt-5 border-t border-gray-200">
                        <dl className="sm:divide-y sm:divide-gray-200 grid grid-cols-2 gap-4">
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Material</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.material}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Material Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.material_name}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Material Type</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.material_type}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Material Number</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.material_nr}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Unit</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{units.find((u) => u.id === material.unit)?.name}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Division</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.division}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Product Allocation</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.product_allocation} pcs</dd>
                            </div>

                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Material Status</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{materialStatus.find((m) => m.id === material.material_status)?.name}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Material Group</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.material_group}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Office</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.office}</dd>
                            </div>

                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Valid from</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.valid_from}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Item Group</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.item_group}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Auth Group</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.auth_group}</dd>
                            </div>

                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Gross Weight</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.gross_weight}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Net Weight</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.net_weight}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Weight Unit</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.unit_weight}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Volume</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.volume}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Size</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.size}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">EAN/UPC</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.ean}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Packaging Material</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{material.packaging_material}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{moment(material.createdAt).format("DD MMM. YYYY - hh:mm:ss")}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Last Update</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{moment(material.updatedAt).format("DD MMM. YYYY - hh:mm:ss")}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {material.material_description}
                                </dd>
                            </div>
                        </dl>
                    </div>

                </div>
            </Content.Container>
        </AccountLayout>
    );
}

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);


    const material = await getMaterial(ctx.params.id);

    return {
        props: {
            material: JSON.parse(JSON.stringify(material))
        }
    }
}
