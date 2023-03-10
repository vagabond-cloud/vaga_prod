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
import { getProductPasses, getLocationsByModule, getModule } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useForm, Controller } from "react-hook-form";
import Pagniation from '@/components/Pagination/';
import generateVID from '@/lib/server/vid';
import { units } from '@/config/common/units';
import { ageGroups } from '@/config/common/ageGroups';

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function Pass({ modules, passes, workspace, total, locations }) {


    const router = useRouter();
    const { workspaceSlug, id, page } = router.query;

    const defaultValues = {
        vid: generateVID(),
        version: '',
        identification: '',
        identification_value: '',
        product_name: '',
        parent_organization: '',
        brand: '',
        product_description: '',
        intended_sale: '',
        season: '',
        retail_price: '',
        companyid: '',
        product_website: '',
        currency_code: '',
        size: '',
        product_color: '',
        age_group: '',
        gender: '',
        categorization_standard: '',
        product_family: '',
        product_category: '',
        country_origin: '',
        manufacturing_facility: '',
        manufacturing_name: '',
        material_traceability_provider: '',
        material_type: '',
        finishes: '',
        material_certifications: '',
        net_weight: '',
        id_type: '',
        id_material: '',
        id_location: '',
        material_composition: '',
        deposit: false,
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => createProductPass(data);


    const createProductPass = async (data) => {

        try {
            const res = await api(`/api/modules/product-pass/pass`, {
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
                toast.error('Error creating Product Pass');
            }
        } catch (error) {
            toast.error(`Error creating Product Pass: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    const writeLog = async () => {
        toast.success('Product Pass created successfully')
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
                <div className="mt-4">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-xl font-semibold text-gray-900">Product Pass</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                A list of all the Product Passes in your Workspace.
                            </p>
                        </div>
                        <SlideOver
                            title="Add Product Pass"
                            subTitle="Add a new Pass to your Product Pass"
                            buttonTitle="Add Pass"
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
                                                <Select label="Version *" {...field}>
                                                    <option value="">Select Version</option>
                                                    <option value="1.0.0">1.0.0</option>
                                                    <option value="1.0.1">1.0.1</option>
                                                </Select>
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.version?.type === 'required' && <p role="alert">Version is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <Controller
                                            name="identification"
                                            id="identification"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select label="Identificaiton *" {...field}>
                                                    <option value="">Select Identification</option>
                                                    <option value="vid">VID</option>
                                                    <option value="ean">EAN</option>
                                                    <option value="sku">SKU</option>
                                                    <option value="other">Other</option>
                                                </Select>
                                            )}
                                        />
                                        <div className="text-red-600 mt-1 text-xs">{errors.identification?.type === 'required' && <p role="alert"> Identificaiton is required</p>}</div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="identification_value"
                                                id="identification_value"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Identification Value *"
                                                        {...field}

                                                    />
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.identification_value?.type === 'required' && <p role="alert">Identification Value is required</p>}</div>
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="product_name"
                                                id="product_name"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Product Name *"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.product_name?.type === 'required' && <p role="alert">Product Name is required</p>}</div>
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="parent_organization"
                                                id="parent_organization"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Parent Organization *"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.parent_organization?.type === 'required' && <p role="alert">Parent Organization is required</p>}</div>

                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="brand"
                                                id="brand"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Brand *"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="product_description"
                                                id="product_description"
                                                control={control}
                                                render={({ field }) => (
                                                    <Textarea
                                                        label="Description *"
                                                        {...field}
                                                        rows={3}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="intended_sale"
                                                id="intended_sale"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Intended Sale *"
                                                        {...field}
                                                        type="date"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="season"
                                                id="season"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Season"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="retail_price"
                                                id="retail_price"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Retail Price"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="currency_code"
                                                id="currency_code"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select label="Identificaiton *" {...field}>
                                                        <option value="">Select Currency</option>
                                                        <option value="eur">EUR</option>
                                                        <option value="usd">USD</option>
                                                        <option value="yen">YEN</option>
                                                        <option value="other">Other</option>
                                                    </Select>
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
                                                name="product_color"
                                                id="product_color"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Product Color"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="age_group"
                                                id="age_group"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select label="Age Group" {...field}>
                                                        <option value="">Select Age Group</option>
                                                        {ageGroups.map((age, index) => (
                                                            <option key={index} value={age.id}>{age.display}</option>
                                                        ))
                                                        }
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="gender"
                                                id="gender"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select label="Gender" {...field}>
                                                        <option value="">Select Gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="diverse">Diverse</option>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="categorization_standard"
                                                id="categorization_standard"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Categorization Standard"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="product_family"
                                                id="product_family"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Product Family"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="product_category"
                                                id="product_category"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Product Category"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="country_origin"
                                                id="country_origin"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select label="Country of Origin" {...field}>
                                                        <option value="">Select Country</option>
                                                        {countries.map((location, index) => (
                                                            <option key={index} value={location.code}>{location.name}</option>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.country_origin?.type === 'required' && <p role="alert">Country of Origin is required</p>}</div>

                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="manufacturing_facility"
                                                id="manufacturing_facility"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Manufacturing Facility"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="manufacturing_name"
                                                id="manufacturing_name"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Manufacturing Name"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="material_traceability_provider"
                                                id="material_traceability_provider"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Manufacturing Name"
                                                        {...field}
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
                                                        label="Manufacturing Name"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="finishes"
                                                id="finishes"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Finishes"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="material_certifications"
                                                id="material_certifications"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Material Certifications"
                                                        {...field}
                                                    />
                                                )}
                                            />
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
                                                        label="Net Weight"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="product_website"
                                                id="product_website"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Website"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="id_type"
                                                id="id_type"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select label="Identifier (Type)" {...field}>
                                                        <option value="">Select Type</option>
                                                        <option value="rfid">RFID</option>
                                                        <option value="nfc">NFC</option>
                                                        <option value="qrcode">QR Code</option>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="id_material"
                                                id="id_material"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select label="Identifier (Material)" {...field}>
                                                        <option value="">Select Type</option>
                                                        <option value="rfid">RFID</option>
                                                        <option value="nfc">NFC</option>
                                                        <option value="qrcode">QR Code</option>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="id_location"
                                                id="id_location"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select label="Identifier (Location)" {...field}>
                                                        <option value="">Select Type</option>
                                                        <option value="rfid">RFID</option>
                                                        <option value="nfc">NFC</option>
                                                        <option value="qrcode">QR Code</option>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="material_composition"
                                                id="material_composition"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Material Composition"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="deposit"
                                                id="deposit"
                                                control={control}
                                                render={({ field: props }) => (
                                                    <Input
                                                        {...props}
                                                        type="checkbox"
                                                        checked={props.value}
                                                        label="Deposit"
                                                        onChange={(e) => props.onChange(e.target.checked)}
                                                        className="w-4 h-4"
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
                                                    Product Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Brand
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Category
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Net Weight
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
                                                        {pass.product_name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{pass.brand}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{pass.categorization_standard}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{pass.net_weight}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{moment(pass.valid_from).format("DD MMM. YYYY")}</td>


                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                                                        <Link href={`/account/${workspaceSlug}/modules/product-pass/dashboard/pass/card/${pass.id}`} className="text-red-600 hover:text-red-900">
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

export default Pass


export async function getServerSideProps(context) {

    const { page } = context.query
    const session = await getSession(context);
    let isTeamOwner = false;
    let workspace = null;

    const modules = await getModule(context.params.id);
    console.log(modules.id)
    const productPasses = await getProductPasses(!page ? 1 : page, 10, { id: 'asc' }, modules.id)
    const locations = await getLocationsByModule(modules.id);
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
            passes: JSON.parse(JSON.stringify(productPasses.passes)),
            locations: JSON.parse(JSON.stringify(locations)),
            total: productPasses.total
        }
    }
}