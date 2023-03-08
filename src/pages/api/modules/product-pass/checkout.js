import { createCheckOut } from '@/prisma/services/modules';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {
        const { data } = req.body;
        const checkout = await createCheckOut(data);
        return res.status(200).json({ data: checkout });
    } else {
        return res.status(200).json({ data: 'Method not allowed' });
    }
};


export default handler;
