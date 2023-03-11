import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Button from '@/components/Button/index';
import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import SlideOver from '@/components/SlideOver';
import api from '@/lib/common/api';

import { AccountLayout } from '@/layouts/index';
import moment from 'moment';
import { Controller, useForm } from "react-hook-form";
import toast from 'react-hot-toast';

import { containerStyle, mapStyles } from '@/config/common/mapStyles';
import { getMap } from '@/lib/server/map';
import { getLocation } from '@/prisma/services/modules';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function MaterialDetails({ location, lat, lng }) {
    const router = useRouter();
    const { workspaceSlug, id } = router.query;

    const defaultValues = {
        vid: location.vid || '',
        location_name: location.location_name || '',
        street: location.street || '',
        postal: location.postal || '',
        city: location.city || '',
        country: location.country || '',
        po_box: location.po_box || '',
        po_code: location.po_code || '',
        language: location.language || '',
        phone: location.phone || '',
        fax: location.fax || '',
        email: location.email || '',
        standard_comm_method: location.standard_comm_method || '',
        is_plant: location.is_plant || false,
        plant_id: location.plant_id || '',
        plant_name: location.plant_name || '',
        fork_lift: location.fork_lift || false,
        lift_gate: location.lift_gate || false,
        loading_dock: location.loading_dock || false,
        photo_allowed: location.photo_allowed || false,
        floor_protection: location.floor_protection || false,
        insurance: location.insurance || false,
        union_labor: location.union_labor || false,
        height_limit: location.height_limit || '',
        security_clearance: location.security_clearance || false,
        docking_from: location.docking_from || '',
        docking_to: location.docking_to || '',
        max_truck_size: location.max_truck_size || '',
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => updateLocation(data);

    const updateLocation = async (data) => {

        const res = await api(`/api/modules/product-pass/location`, {
            method: 'PUT',
            body: {
                id: location.id,
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

    return (
        <AccountLayout>
            <Meta title={`Vagabond - Locations | Dashboard`} />
            <Content.Title
                title="Locations"
                subtitle="Overview of your Locations"
            />
            <Content.Divider />
            <Content.Container>
                <div>
                    <div className="justify-between mt-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <div>
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Location Information</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details for selected Location</p>
                        </div>
                        <SlideOver
                            title="Edit Location"
                            subTitle="Edit a new Location to your Product Pass"
                            buttonTitle="Edit Location"
                        >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="overflow-scroll h-full pb-20">

                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="location_name"
                                                id="location_name"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Location Name *"
                                                        {...field}

                                                    />
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.location_name?.type === 'required' && <p role="alert">Location Name is required</p>}</div>

                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="street"
                                                id="street"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Street"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.street?.type === 'required' && <p role="alert">Street is required</p>}</div>
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="postal"
                                                id="postal"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Zip"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="city"
                                                id="city"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        label="City *"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.city?.type === 'required' && <p role="alert">City is required</p>}</div>
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="country"
                                                id="country"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Country *"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            <div className="text-red-600 mt-1 text-xs">{errors.country?.type === 'required' && <p role="alert">Country is required</p>}</div>
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="po_box"
                                                id="po_box"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="PO Box"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="po_code"
                                                id="po_code"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="PO Code"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="language"
                                                id="language"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Language"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="phone"
                                                id="phone"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Phone"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="fax"
                                                id="fax"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Fax"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="email"
                                                id="email"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Email"
                                                        {...field}
                                                        type="email"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="standard_comm_method"
                                                id="standard_comm_method"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Standard Communication Method"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="is_plant"
                                                id="is_plant"
                                                control={control}
                                                render={({ field: props }) => (
                                                    <Input
                                                        {...props}
                                                        type="checkbox"
                                                        checked={props.value}
                                                        label="Is Plant?"
                                                        onChange={(e) => props.onChange(e.target.checked)}
                                                        className="w-4 h-4"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="plant_id"
                                                id="plant_id"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Plant ID"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 my-10">
                                        <div className="mt-1">
                                            <Controller
                                                name="plant_name"
                                                id="plant_name"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        label="Plant Name"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="px-4 my-10">
                                            <div className="mt-1">
                                                <Controller
                                                    name="fork_lift"
                                                    id="fork_lift"
                                                    control={control}
                                                    render={({ field: props }) => (
                                                        <Input
                                                            {...props}
                                                            type="checkbox"
                                                            checked={props.value}
                                                            label="Fork Lift Available?"
                                                            onChange={(e) => props.onChange(e.target.checked)}
                                                            className="w-4 h-4"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4 my-10">
                                            <div className="mt-1">
                                                <Controller
                                                    name="lift_gate"
                                                    id="lift_gate"
                                                    control={control}
                                                    render={({ field: props }) => (
                                                        <Input
                                                            {...props}
                                                            type="checkbox"
                                                            checked={props.value}
                                                            label="Lift Gate?"
                                                            onChange={(e) => props.onChange(e.target.checked)}
                                                            className="w-4 h-4"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4 my-10">
                                            <div className="mt-1">
                                                <Controller
                                                    name="loading_dock"
                                                    id="loading_dock"
                                                    control={control}
                                                    render={({ field: props }) => (
                                                        <Input
                                                            {...props}
                                                            type="checkbox"
                                                            checked={props.value}
                                                            label="Loading Dock?"
                                                            onChange={(e) => props.onChange(e.target.checked)}
                                                            className="w-4 h-4"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4 my-10">
                                            <div className="mt-1">
                                                <Controller
                                                    name="photo_allowed"
                                                    id="photo_allowed"
                                                    control={control}
                                                    render={({ field: props }) => (
                                                        <Input
                                                            {...props}
                                                            type="checkbox"
                                                            checked={props.value}
                                                            label="Photos Allowed?"
                                                            onChange={(e) => props.onChange(e.target.checked)}
                                                            className="w-4 h-4"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4 my-10">
                                            <div className="mt-1">
                                                <Controller
                                                    name="floor_protection"
                                                    id="floor_protection"
                                                    control={control}
                                                    render={({ field: props }) => (
                                                        <Input
                                                            {...props}
                                                            type="checkbox"
                                                            checked={props.value}
                                                            label="Floor Production?"
                                                            onChange={(e) => props.onChange(e.target.checked)}
                                                            className="w-4 h-4"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4 my-10">
                                            <div className="mt-1">
                                                <Controller
                                                    name="insurance"
                                                    id="insurance"
                                                    control={control}
                                                    render={({ field: props }) => (
                                                        <Input
                                                            {...props}
                                                            type="checkbox"
                                                            checked={props.value}
                                                            label="Insurance?"
                                                            onChange={(e) => props.onChange(e.target.checked)}
                                                            className="w-4 h-4"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4 my-10 col-span-2">

                                            <div className="mt-1">
                                                <Controller
                                                    name="union_labor"
                                                    id="union_labor"
                                                    control={control}
                                                    render={({ field: props }) => (
                                                        <Input
                                                            {...props}
                                                            type="checkbox"
                                                            checked={props.value}
                                                            label="Union Labor?"
                                                            onChange={(e) => props.onChange(e.target.checked)}
                                                            className="w-4 h-4"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4 my-10">
                                            <div className="mt-1">
                                                <Controller
                                                    name="height_limit"
                                                    id="height_limit"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            label="Hight Limit"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4 my-10">
                                            <div className="mt-1">
                                                <Controller
                                                    name="security_clearance"
                                                    id="security_clearance"
                                                    control={control}
                                                    render={({ field: props }) => (
                                                        <Input
                                                            {...props}
                                                            type="Security Clearance?"
                                                            checked={props.value}
                                                            label="Union Labor?"
                                                            onChange={(e) => props.onChange(e.target.checked)}
                                                            className="w-4 h-4"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4 my-10">
                                            <div className="mt-1">
                                                <Controller
                                                    name="docking_from"
                                                    id="docking_from"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            label="Docking From"
                                                            {...field}
                                                            type="time"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4 my-10">
                                            <div className="mt-1">
                                                <Controller
                                                    name="docking_to"
                                                    id="docking_to"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            label="Docking To"
                                                            {...field}
                                                            type="time"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4 my-10">
                                            <div className="mt-1">
                                                <Controller
                                                    name="max_truck_size"
                                                    id="max_truck_size"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            label="Truck size"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
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
                    <div className="my-10">
                        {isLoaded &&
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={mapCenter}
                                zoom={13}
                                options={{ styles: mapStyles }}
                            >
                                <MarkerF onLoad={onLoad} icon={"http://maps.google.com/mapfiles/ms/icons/red.png"}
                                    position={mapCenter} ></MarkerF>


                                <></>
                            </GoogleMap>
                        }
                    </div>
                    <div className="mt-5 border-t border-gray-200">
                        <dl className="sm:divide-y sm:divide-gray-200 grid grid-cols-2 gap-4">
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.location_name}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Street</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.street}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Zip</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.postal}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">City</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.city}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Country</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.country}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">PO Box</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.po_box}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">PO Code</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.po_code}</dd>
                            </div>

                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Language</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.language}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.phone}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Fax</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.fax}</dd>
                            </div>

                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.email}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Com. Method</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.standard_comm_method}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Is Plant</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.is_plant ? <CheckCircleIcon className="w-6 h-6 text-gray-600" /> : <XCircleIcon className="w-6 h-6 text-gray-600" />}</dd>
                            </div>

                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Plant ID</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.plant_id}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Plant Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.plant_name}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Fork Lift</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.fork_lift ? <CheckCircleIcon className="w-6 h-6 text-gray-600" /> : <XCircleIcon className="w-6 h-6 text-gray-600" />}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Lift Gate</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.lift_gate ? <CheckCircleIcon className="w-6 h-6 text-gray-600" /> : <XCircleIcon className="w-6 h-6 text-gray-600" />}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Loading Dock</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.loading_dock ? <CheckCircleIcon className="w-6 h-6 text-gray-600" /> : <XCircleIcon className="w-6 h-6 text-gray-600" />}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Taking Photos</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.photo_allowed ? <CheckCircleIcon className="w-6 h-6 text-gray-600" /> : <XCircleIcon className="w-6 h-6 text-gray-600" />}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Floor Protection</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.floor_protection ? <CheckCircleIcon className="w-6 h-6 text-gray-600" /> : <XCircleIcon className="w-6 h-6 text-gray-600" />}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Insurance</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.insurance ? <CheckCircleIcon className="w-6 h-6 text-gray-600" /> : <XCircleIcon className="w-6 h-6 text-gray-600" />}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Union Labor</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.union_labor ? <CheckCircleIcon className="w-6 h-6 text-gray-600" /> : <XCircleIcon className="w-6 h-6 text-gray-600" />}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Height Limit</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.height_limit}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Security Clearance</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.security_clearance ? <CheckCircleIcon className="w-6 h-6 text-gray-600" /> : <XCircleIcon className="w-6 h-6 text-gray-600" />}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Max Truck Size</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.max_truck_size}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Docking hours from</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.docking_from}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Docking hours to</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{location.docking_to}</dd>
                            </div>

                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{moment(location.createdAt).format("DD MMM. YYYY - hh:mm:ss")}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">Last Update</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{moment(location.updatedAt).format("DD MMM. YYYY - hh:mm:ss")}</dd>
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

    const location = await getLocation(ctx.params.id);

    const map = await getMap(location?.country + ' ' + location.city + ' ' + location.street)

    return {
        props: {
            location: JSON.parse(JSON.stringify(location)),
            lat: map.lat,
            lng: map.lng
        }
    }
}
