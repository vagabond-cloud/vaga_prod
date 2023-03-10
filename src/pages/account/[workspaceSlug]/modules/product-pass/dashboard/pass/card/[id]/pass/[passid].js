import { useState, useEffect } from 'react';
import { getSubPassByPassid } from '@/prisma/services/modules';
import { countries } from '@/config/common/countries';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Content from '@/components/Content/index';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Meta from '@/components/Meta/index';
import Select from '@/components/Select';
import Button from '@/components/Button/index';
import SlideOver from '@/components/SlideOver';
import api from '@/lib/common/api';
import Modal from '@/components/Modal';
import moment from 'moment';
import { Controller, useForm } from "react-hook-form";
import { GoogleMap, MarkerF, useJsApiLoader, InfoBox, Polyline } from '@react-google-maps/api';
import { mapStyles, containerStyle } from '@/config/common/mapStyles';
import QRModal from '@/components/modules/product-pass/qrModal';
import toast from 'react-hot-toast';
import { AccountLayout } from '@/layouts/index';
import { TicketIcon, CameraIcon } from '@heroicons/react/24/outline';

export default function Pass({ subPass }) {

    const router = useRouter();
    const { workspaceSlug, id, passid } = router.query;

    const [showModal, setShowModal] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [submitQR, setSubmitQR] = useState(false);


    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const defaultValues = {
        pp_productPassid: subPass.pp_productPassid,
        pp_subProductpassid: subPass.id,
        vid: subPass.vid,
        type: '',
        name: '',
        address: '',
        city: '',
        country: '',
        description: '',
        batch: ''
    }


    const { handleSubmit, control, reset, formState: { errors } } = useForm({ defaultValues });
    const onSubmit = data => captureLocation(data);

    const captureLocation = async (data) => {
        const res = await api(`/api/modules/product-pass/captureLocation`, {
            method: 'POST',
            body: {
                data
            }
        })
        if (res.error) return toast.error(res.error);

        toggleModal()
        reset()
        toast.success("Location captured successfully")
        router.replace(router.asPath)
    }

    const checkin = subPass.pp_checkIn;
    const checkout = subPass.pp_checkOut;

    const checkinArray = checkin.map(({ lat, lng, createdAt }) => ({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        createdAt
    }));

    const checkoutArray = checkout.map(({ lat, lng, createdAt }) => ({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        createdAt
    }));

    const pathArray = checkinArray.concat(checkoutArray);

    var PATHS = pathArray.sort(function (a, b) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const mapCenter = PATHS[0]

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
            <Meta title={`Vagabond - Product Pass | Dashboard`} />
            <Content.Title
                title="Product Pass"
                subtitle="Overview of your Product Pass"
            />
            <Content.Divider />
            <Content.Container>
                <div className="flex gap-4 justify-end">

                    <div className="flex justify-end">
                        <Button className="bg-red-600 text-white hover:bg-red-500" onClick={toggleModal}><CameraIcon className="text-white w-6 h-6" /></Button>
                    </div>
                    <div className="flex justify-end">
                        <QRModal url={`${process.env.NEXT_PUBLIC_APP_URL}/${subPass.vid}/pass/${subPass.passid}`} />
                    </div>
                    <div className="flex justify-end">
                        <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/${subPass.vid}/pass/${subPass.passid}`} target="_blank">
                            <Button className="bg-red-600 text-white hover:bg-red-500"><TicketIcon className="text-white w-6 h-6" /></Button>
                        </Link>
                    </div>

                </div>
                {PATHS.length > 0 && isLoaded &&
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={mapCenter}
                        zoom={7}
                        options={{ styles: mapStyles, minZoom: 2 }}
                    >
                        <MarkerF
                            onLoad={onLoad}
                            icon={"http://maps.google.com/mapfiles/ms/icons/red.png"}
                            position={mapCenter}
                        />
                        {PATHS.map((item, index) => {
                            return (
                                <MarkerF
                                    key={index}
                                    onLoad={onLoad}
                                    icon={"http://maps.google.com/mapfiles/ms/icons/red.png"}
                                    position={item}
                                />
                            )
                        }
                        )}


                    </GoogleMap>
                }
                <div className="grid grid-cols-2 gap-4 my-10">
                    <div>
                        <p className="font-bold">Check In</p>
                        <div className="mt-8 flex flex-col">
                            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                        Name
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Lat
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Lng
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Date
                                                    </th>
                                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                        <span className="sr-only">Edit</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {checkin.map((pass, index) => (
                                                    <tr key={index} className="hover:bg-gray-100">
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 flex gap-2 items-center">
                                                            {pass.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{pass.lat}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{pass.lng}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{moment(pass.createdAt).format("DD MMM. YY | hh:mm:ss")}</td>

                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 flex justify-end text-right text-xs font-medium sm:pr-6">

                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold">Check Out</p>
                        <div className="mt-8 flex flex-col">
                            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                        Name
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Lat
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Lng
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Date
                                                    </th>
                                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                        <span className="sr-only">Edit</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {checkout.map((pass, index) => (
                                                    <tr key={index} className="hover:bg-gray-100">
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6 flex gap-2 items-center">
                                                            {pass.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{pass.lat}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{pass.lng}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{moment(pass.createdAt).format("DD MMM. YY | hh:mm:ss")}</td>

                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 flex justify-end text-right text-xs font-medium sm:pr-6">

                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={showModal} title="Capture Position" toggle={toggleModal}>
                    <div className="w-[700px]">
                        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <Controller
                                        name="type"
                                        id="type"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                label="Type"
                                            >
                                                <option value="">Select Type</option>
                                                <option value="checkin">Check In</option>
                                                <option value="checkout">Check Out</option>
                                            </Select>
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.time?.type === 'required' && <p role="alert">Time is required</p>}</div>
                                </div>
                                <div className="mb-4">
                                    <Controller
                                        name="name"
                                        id="name"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                label="Title"
                                                placeholder="Title"
                                                {...field}
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.time?.type === 'required' && <p role="alert">Time is required</p>}</div>
                                </div>
                                <div className="mb-4">
                                    <Controller
                                        name="city"
                                        id="city"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                label="City"
                                                placeholder="City"
                                                {...field}
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.time?.type === 'required' && <p role="alert">Time is required</p>}</div>
                                </div>
                                <div className="mb-4">
                                    <Controller
                                        name="address"
                                        id="address"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                label="Address"
                                                placeholder="Address"
                                                {...field}
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.time?.type === 'required' && <p role="alert">Time is required</p>}</div>
                                </div>
                                <div className="mb-4">
                                    <Controller
                                        name="country"
                                        id="country"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                label="Country"
                                                placeholder="Country"
                                                {...field}
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.time?.type === 'required' && <p role="alert">Time is required</p>}</div>
                                </div>
                                <div className="mb-4">
                                    <Controller
                                        name="batch"
                                        id="batch"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                label="Batch"
                                                placeholder="Batch"
                                                {...field}
                                            />
                                        )}
                                    />
                                    <div className="text-red-600 mt-1 text-xs">{errors.time?.type === 'required' && <p role="alert">Time is required</p>}</div>
                                </div>
                                <div className="mb-4 col-span-2">
                                    <Controller
                                        name="description"
                                        id="description"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Textarea
                                                label="Description"
                                                rows={3}
                                                {...field}
                                            />
                                        )}
                                    />
                                    <div className="-red-600 mt-1 text-xs">{errors.time?.type === 'required' && <p role="alert">Time is required</p>}</div>
                                </div>
                                <div className="my-4">
                                    <Button className="bg-red-600 text-white hover:bg-red-500">Capture</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal>
            </Content.Container>
        </AccountLayout >

    );
}

export async function getServerSideProps(ctx) {

    const subPass = await getSubPassByPassid(ctx.params.passid);

    return {
        props: {
            subPass: JSON.parse(JSON.stringify(subPass)),

        }
    }
}
