/* eslint-disable react-hooks/rules-of-hooks */
/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
import { useState, useEffect } from 'react';
import { getProductPassByVID, getSubPassByPassid } from '@/prisma/services/modules';
import { getMap } from '@/lib/server/map'
import { countries } from '@/config/common/countries';
import api from '@/lib/common/api';
import { GoogleMap, MarkerF, useJsApiLoader, InfoBox, Polyline } from '@react-google-maps/api';
import { mapStyles, containerStyle } from '@/config/common/mapStyles';

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function index({ subPass, pass, qr, lat, lng }) {

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

    const checkin = subPass.pp_checkIn.map(({ lat, lng, createdAt }) => ({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        createdAt
    }));

    const checkout = subPass.pp_checkOut.map(({ lat, lng, createdAt }) => ({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        createdAt
    }));


    const pathArray = checkin.concat(checkout);

    var PATHS = pathArray.sort(function (a, b) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="flex flex-col items-center justify-center bg-gray-900">
            <div className="flex flex-col items-center justify-cente bg-gray-900">
                <div className="">
                    <img src="/android-chrome-192x192.png" className="w-12 mt-10" alt='' />
                </div>
                <div className="absolute inset-0 z-0"></div>
                <div className="max-w-2xl w-full h-full mx-auto z-10 bg-gray-900 rounded-xl  my-10">
                    <div className="flex flex-col">
                        <div className="bg-white relative drop-shadow-2xl  rounded-3xl p-4 m-4">
                            <div className="flex-none sm:flex">
                                <div className=" relative h-32 w-32 sm:mb-0 mb-3 hidden">
                                    <a href="#"
                                        className="absolute -right-2 bottom-2   -ml-3  text-white p-1 text-xs bg-green-400 hover:bg-green-500 font-medium tracking-wider rounded-full transition ease-in duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                            className="h-4 w-4">
                                            <path
                                                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z">
                                            </path>
                                        </svg>
                                    </a>
                                </div>
                                <div className="flex-auto justify-evenly ">
                                    <div className="flex items-center justify-between px-6">
                                        <div className="flex items-center my-1">
                                            <h2 className="font-medium">{subPass.passid}</h2>
                                        </div>
                                        <div className="ml-auto text-gray-800">Verified</div>
                                    </div>
                                    <div className="border-dashed border-b-2 my-5"></div>
                                    <div className="flex items-center w-full h-96 overflow-hidden">
                                        <img src={pass.pp_productImages[0].url} className="object-cover rounded-xl" />
                                    </div>
                                    <div className="border-dashed border-b-2 my-5 pt-5">
                                        <div className="absolute rounded-full w-5 h-5 bg-gray-900 -mt-2 -left-2"></div>
                                        <div className="absolute rounded-full w-5 h-5 bg-gray-900 -mt-2 -right-2"></div>
                                    </div>
                                    <div className="flex items-center px-6">
                                        <div className="grid xs:grid-cols-1 md:grid-cols-2 w-full gap-4">
                                            <div className="md:col-span-2 my-6">
                                                <p className="text-xs text-gray-200">Vagabond ID</p>
                                                <p className="text-sm">{pass.vid}</p>
                                            </div>
                                            <div className="">
                                                <p className="text-xs text-gray-200">Product Name</p>
                                                <p className="text-sm">{pass.product_name}</p>
                                            </div>
                                            <div className="">
                                                <p className="text-xs text-gray-200">Brand</p>
                                                <p className="text-sm">{pass.brand}</p>
                                            </div>
                                            <div className="">
                                                <p className="text-xs text-gray-200">Company</p>
                                                <p className="text-sm">{pass.parent_organization}</p>
                                            </div>
                                            <div className="">
                                                <p className="text-xs text-gray-200">Retail Price</p>
                                                <p className="text-sm">{pass.retail_price} {pass.currency_code ? pass.currency_code?.toUpperCase() : ''}</p>
                                            </div>
                                            <div className="">
                                                <p className="text-xs text-gray-200">Size</p>
                                                <p className="text-sm">{pass.size}</p>
                                            </div>
                                            <div className="">
                                                <p className="text-xs text-gray-200">Gender</p>
                                                <p className="text-sm">{pass.gender}</p>
                                            </div>
                                            <div className="">
                                                <p className="text-xs text-gray-200">Country of Origin</p>
                                                <p className="text-sm">{countries.find((c) => c.code === pass.country_origin)?.name}</p>
                                            </div>
                                            <div className="">
                                                <p className="text-xs text-gray-200">Net Weight</p>
                                                <p className="text-sm">{pass.net_weight}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-dashed border-b-2 my-5 pt-5">
                                        <div className="absolute rounded-full w-5 h-5 bg-gray-900 -mt-2 -left-2"></div>
                                        <div className="absolute rounded-full w-5 h-5 bg-gray-900 -mt-2 -right-2"></div>
                                    </div>
                                    <div className="flex items-center mb-5 p-5 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-200">Description</span>
                                            <div className="font-semibold">{pass.product_description}</div>
                                        </div>
                                    </div>
                                    <div className="border-dashed border-b-2 my-5 pt-5">
                                        <div className="absolute rounded-full w-5 h-5 bg-gray-900 -mt-2 -left-2"></div>
                                        <div className="absolute rounded-full w-5 h-5 bg-gray-900 -mt-2 -right-2"></div>
                                    </div>
                                    <div className="my-6">
                                        <p className="text-md font-bold my-4">Country of Origin</p>
                                        {isLoaded &&
                                            <GoogleMap
                                                mapContainerStyle={containerStyle}
                                                center={PATHS[0] ? PATHS[0] : mapCenter}
                                                zoom={7}
                                                options={{ styles: mapStyles, minZoom: 2 }}
                                            >
                                                <MarkerF
                                                    onLoad={onLoad}
                                                    icon={"http://maps.google.com/mapfiles/ms/icons/red.png"}
                                                    position={PATHS[0] ? PATHS[0] : mapCenter}
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
                                                <Polyline
                                                    key={1}
                                                    path={PATHS.map(item => ({ lat: item.lat, lng: item.lng }))}
                                                    options={{
                                                        geodesic: true,
                                                        strokeColor: '#FF0000',
                                                        strokeOpacity: 0.8,
                                                        strokeWeight: 2,
                                                        fillColor: '#FF0000',
                                                        fillOpacity: 0.35,
                                                        clickable: false,
                                                        draggable: false,
                                                        editable: false,
                                                        visible: true,
                                                        radius: 30000,
                                                    }}
                                                />
                                            </GoogleMap>
                                        }
                                    </div>
                                    <div className="border-dashed border-b-2 my-5 pt-5">
                                        <div className="absolute rounded-full w-5 h-5 bg-gray-900 -mt-2 -left-2"></div>
                                        <div className="absolute rounded-full w-5 h-5 bg-gray-900 -mt-2 -right-2"></div>
                                    </div>
                                    <div className="md:flex items-center justify-between px-5 pt-3 text-sm">
                                        <div className="flex flex-col xs:my-4 md:my-0">
                                            <span className="text-xs text-gray-200">Identification (Type)</span>
                                            <div className="font-semibold">{pass.id_type?.toUpperCase()}</div>
                                        </div>
                                        <div className="flex flex-col xs:my-4 md:my-0">
                                            <span className="text-xs text-gray-200">Identification (Material)</span>
                                            <div className="font-semibold">{pass.id_material?.toUpperCase()}</div>
                                        </div>
                                        <div className="flex flex-col xs:my-4 md:my-0">
                                            <span className="text-xs text-gray-200">Identification (Location)</span>
                                            <div className="font-semibold">{pass.id_location?.toUpperCase()}</div>
                                        </div>
                                    </div>
                                    <div className="border-dashed border-b-2 my-5 pt-5">
                                        <div className="absolute rounded-full w-5 h-5 bg-gray-900 -mt-2 -left-2"></div>
                                        <div className="absolute rounded-full w-5 h-5 bg-gray-900 -mt-2 -right-2"></div>
                                    </div>
                                    <div className="flex py-5 mx-auto justify-center text-sm ">
                                        {!qr ?
                                            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            :
                                            <img src={qr} alt="" className="w-60" />
                                        }
                                        <div className="barcode h-14 w-0 inline-block mt-4 relative left-auto"></div>
                                    </div>
                                    <div className="border-dashed border-b-2 my-5 pt-5">
                                        <div className="absolute rounded-full w-5 h-5 bg-gray-900 -mt-2 -left-2"></div>
                                        <div className="absolute rounded-full w-5 h-5 bg-gray-900 -mt-2 -right-2"></div>
                                    </div>
                                    <div className="flex flex-col text-center my-10">
                                        <span className="text-xs text-gray-200">Generated by Vagabond Solutions</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export async function getServerSideProps(ctx) {

    const subPass = await getSubPassByPassid(ctx.params.passid);
    const pass = await getProductPassByVID(subPass.vid);

    const map = await getMap(countries.find((c) => c.code === pass?.country_origin).name)

    const qr = await api(`https://api.vagabonds.cloud/qrcode`, {
        method: 'POST',
        body: {
            session: ctx.params.id,
        }
    })

    return {
        props: {
            pass: JSON.parse(JSON.stringify(pass)),
            subPass: JSON.parse(JSON.stringify(subPass)),
            lat: map.lat,
            lng: map.lng,
            qr: qr.data
        }
    }
}