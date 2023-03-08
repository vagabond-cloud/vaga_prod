import { createCheckIn } from '@/prisma/services/modules';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {
        const { data } = req.body;
        const checkin = await createCheckIn(data);
        return res.status(200).json({ data: checkin });
    } else {
        return res.status(200).json({ data: 'Method not allowed' });
    }
};


export default handler;
