import api from '@/lib/common/api'

export const getMap = async (address) => {
    console.log("address", address)
    const places = !address ? "Frankfurt,Germany" : address
    const map = await api(`https://maps.googleapis.com/maps/api/geocode/json?address=${places}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}`, {
        method: 'GET',
    })
    let location = { lat: '', lng: '' }

    if (map.results[0]) {
        const { lat, lng } = map?.results[0]?.geometry?.location
        location = { lat, lng }
    }

    return location
} 