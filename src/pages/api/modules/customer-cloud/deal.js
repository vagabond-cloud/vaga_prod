import { captureContactActivities } from '@/prisma/services/log';
import { assignDeal } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';



const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'POST') {
        const { dealId, userId } = req.body;
        const log = await assignDeal(dealId, userId);

        return res.status(200).json({ log });
    } else if (method === 'GET') {
        const log = await assignDeal(req.query.id, req.query.page)
        return res.status(200).json({ log });
    }
};


export default handler;
