import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Button from '@/components/Button/index';
import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Meta from '@/components/Meta/index';
import SlideOver from '@/components/SlideOver';
import api from '@/lib/common/api';

import Pagniation from '@/components/Pagination/';
import { AccountLayout } from '@/layouts/index';
import generateVID from '@/lib/server/vid';
import { getLocations, getModule } from '@/prisma/services/modules';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { Controller, useForm } from "react-hook-form";
import toast from 'react-hot-toast';

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function Locations({ modules, materials, workspace, total }) {


    const router = useRouter();
    const { workspaceSlug, id, page } = router.query;

    const defaultValues = {
        vid: generateVID(),
        location_name: '',
        street: '',
        postal: '',
        city: '',
        country: '',
        po_box: '',
        po_code: '',
        language: '',
        phone: '',
        fax: '',
        email: '',
        standard_comm_method: '',
        is_plant: false,
        plant_id: '',
        plant_name: '',
        fork_lift: false,
        lift_gate: false,
        loading_dock: false,
        photo_allowed: false,
        floor_protection: false,
        insurance: false,
        union_labor: false,
        height_limit: '',
        security_clearance: false,
        docking_from: '',
        docking_to: '',
        max_truck_size: '',
    }

    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => createLocation(data);


    const createLocation = async (data) => {

        try {
            const res = await api(`/api/modules/product-pass/location`, {
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
                toast.error('Error creating Locations');
            }
        } catch (error) {
            toast.error(`Error creating Locations: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    const writeLog = async () => {
        toast.success('Location created successfully')
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
                <div className="mt-4">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-xl font-semibold text-gray-900">Location</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                A list of all the Locations in your Workspace.
                            </p>
                        </div>
                        <SlideOver
                            title="Add Location"
                            subTitle="Add a new Location to your Product Pass"
                            buttonTitle="Add Location"
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
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    Location Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    City
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Country
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Is Plant?
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
                                                        {material.location_name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{material.city}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{material.country}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{material.is_plant}</td>

                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-xs font-medium sm:pr-6">
                                                        <Link href={`/account/${workspaceSlug}/modules/product-pass/locations/card/${material.id}`} className="text-red-600 hover:text-red-900">
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

export default Locations


export async function getServerSideProps(context) {

    const { page } = context.query
    const session = await getSession(context);
    let isTeamOwner = false;
    let workspace = null;

    const modules = await getModule(context.params.id);
    const materials = await getLocations(!page ? 1 : page, 10, { id: 'asc' }, modules.id)

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