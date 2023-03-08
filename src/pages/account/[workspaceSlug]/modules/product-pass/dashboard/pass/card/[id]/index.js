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
import { materialStatus } from '@/config/modules/pass';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useForm, Controller } from "react-hook-form";

import { getProductPass, getProductPassImages } from '@/prisma/services/modules';
import { units } from '@/config/common/units';
import { GoogleMap, MarkerF, useJsApiLoader, InfoBox, Polyline } from '@react-google-maps/api';
import { mapStyles, containerStyle } from '@/config/common/mapStyles';
import { getMap } from '@/lib/server/map'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { countries } from '@/config/common/countries';
import { ageGroups } from '@/config/common/ageGroups';
import { uploadToGCS } from '@/lib/client/upload';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function MaterialDetails({ pass, lat, lng, images }) {
    const router = useRouter();
    const { workspaceSlug, id } = router.query;

    const defaultValues = {
        vid: pass.vid || '',
        version: pass.version || '',
        identification: pass.identification || '',
        identification_value: pass.identification_value || '',
        product_name: pass.product_name || '',
        parent_organization: pass.parent_organization || '',
        brand: pass.brand || '',
        product_description: pass.product_description || '',
        intended_sale: pass.intended_sale || '',
        season: pass.season || '',
        retail_price: pass.retail_price || '',
        companyid: pass.companyid || '',
        product_website: pass.product_website || '',
        currency_code: pass.currency_code || '',
        size: pass.size || '',
        product_color: pass.product_color || '',
        age_group: pass.age_group || '',
        gender: pass.gender || '',
        categorization_standard: pass.categorization_standard || '',
        product_family: pass.product_family || '',
        product_category: pass.product_category || '',
        country_origin: pass.country_origin || '',
        manufacturing_facility: pass.manufacturing_facility || '',
        manufacturing_name: pass.manufacturing_name || '',
        material_traceability_provider: pass.material_traceability_provider || '',
        material_type: pass.material_type || '',
        finishes: pass.finishes || '',
        material_certifications: pass.material_certifications || '',
        net_weight: pass.net_weight || '',
        id_type: pass.id_type || '',
        id_material: pass.id_material || '',
        id_location: pass.id_location || '',
        material_composition: pass.material_composition || '',
        deposit: pass.deposit || false,
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => updateLocation(data);

    const tabs = [
        { name: 'Overview', href: '', current: true },
        { name: 'Images', href: 'images', current: false },
        { name: 'Documents', href: 'documents', current: false },
        { name: 'Material List', href: 'materiallist', current: false },
        { name: 'Report', href: 'report', current: false },
        { name: 'Passes', href: 'passes', current: false }
    ]

    const updateLocation = async (data) => {

        const res = await api(`/api/modules/product-pass/pass`, {
            method: 'PUT',
            body: {
                id: pass.id,
                data
            }
        })
        if (res.status === 200) {
            toast.success('Product Pass updated successfully');
            router.replace(router.asPath)
        } else {
            toast.error('Something went wrong');
        }
    }

    const mapCenter = { lat, lng }

    const onLoad = marker => {
        console.log('marker')
    }

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API
    })
    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    const pathCoordinates = [
        { lat: 36.05298765935, lng: -112.083756616339 },
        { lat: 36.2169884797185, lng: -112.056727493181 }
    ];



    return (
        <AccountLayout>
            <Meta title={`Vagabond - Product Pass | Dashboard`} />
            <Content.Title
                title="Product Pass"
                subtitle="Overview of your Product Pass"
            />
            <Content.Divider />
            <Content.Container>
                <div>
                    <div className="justify-between mt-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <div>
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Product Pass</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details for selected Product Pass</p>
                        </div>
                        <div className="flex gap-4">
                            <Button className="bg-gray-300 hover:bg-gray-200 text-sm">Verify Pass</Button>
                            <Link href={`/${pass.vid}`} target="_blank">
                                <Button className="bg-gray-600 text-white hover:gray-red-500 text-sm">View Pass</Button>
                            </Link>
                            <SlideOver
                                title="Edit Product Pass"
                                subTitle="Edit Product Pass"
                                buttonTitle="Edit Pass"
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
                                                            label="Manufacturing Traceability Provider"
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
                                                            label="Manufacturing Type"
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
                    </div>
                    <div className="my-10">
                        {isLoaded &&
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={mapCenter}
                                zoom={7}
                                options={{ styles: mapStyles }}
                            >
                                <MarkerF onLoad={onLoad} icon={"http://maps.google.com/mapfiles/ms/icons/red.png"}
                                    position={mapCenter} ></MarkerF>
                                <></>
                            </GoogleMap>
                        }
                    </div>
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
                    <div className="mt-5 border-t border-gray-200">
                        <dl className="sm:divide-y sm:divide-gray-200 grid grid-cols-2 gap-4">
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">VID</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.vid}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Version</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.street}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Identification</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.identification?.toUpperCase()}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Identification Value</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.identification_value}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Company</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.parent_organization}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Brand</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.brand}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Product Description</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.product_description}</dd>
                            </div>

                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Intended Sale</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.intended_sale}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Season</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.season}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Retail Price</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{parseFloat(pass.retail_price).toFixed(2)}</dd>
                            </div>

                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Main Currency</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.currency_code?.toUpperCase()}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Size</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.size}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Product Color</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.product_color}</dd>
                            </div>

                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Age Group</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{ageGroups.find((a) => a.id === pass.age_group).display}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.gender?.toUpperCase()}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Categorization Standard</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.categorization_standard}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Product Family</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.product_family}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Product Category</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.product_category}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Country of Origin</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{countries.find((c) => c.code === pass.country_origin)?.name}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Manufacturing Facility</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.manufacturing_facility}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Manufacturing Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.manufacturing_name}</dd>
                            </div>

                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Material Traceability Provider</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.material_traceability_provider}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Material Type</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.material_type}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Finishes</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.finishes}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Material Certifications</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.material_certifications}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Net Weight</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.net_weight}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Website</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.product_website}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Identification (Type)</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.id_type?.toUpperCase()}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Identification (Material)</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.id_material?.toUpperCase()}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Identification (Location)</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.id_location?.toUpperCase()}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Material Composition</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.material_composition}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Deposit</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pass.deposit ? <CheckCircleIcon className="w-6 h-6 text-gray-600" /> : <XCircleIcon className="w-6 h-6 text-gray-600" />}</dd>
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

    const pass = await getProductPass(ctx.params.id);
    const images = await getProductPassImages(ctx.params.id);
    const map = await getMap(countries.find((c) => c.code === pass?.country_origin).name)

    return {
        props: {
            pass: JSON.parse(JSON.stringify(pass)),
            images: JSON.parse(JSON.stringify(images)),
            lat: map.lat,
            lng: map.lng
        }
    }
}
