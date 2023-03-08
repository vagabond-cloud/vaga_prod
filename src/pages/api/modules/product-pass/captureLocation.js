import { createCheckIn, createCheckOut } from '@/prisma/services/modules';
import { getMap } from '@/lib/server/map'

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {
        const { data } = req.body;
        const map = await getMap(data.city + data.address + data.country)

        if (!map.lat || !map.lng) return res.status(200).json({ error: 'No location found' });

        const blob = {
            lat: map.lat,
            lng: map.lng,
            name: data.name,
            vid: data.vid,
            description: data.description,
            batch: data.batch,
            pp_productPassid: data.pp_productPassid,
            pp_subProductpassid: data.pp_subProductpassid,
        }

        if (data.type === 'checkin') {
            const location = await createCheckIn(blob)
            return res.status(200).json({ data: location });

        } else {
            const location = await createCheckOut(blob)
            return res.status(200).json({ data: location });

        }
    } else {

        return res.status(200).json({ data: 'Method not allowed' });

    }
};


export default handler;
