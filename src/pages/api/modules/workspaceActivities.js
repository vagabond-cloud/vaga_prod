import { captureContactActivities } from '@/prisma/services/log';
import { getActivity } from '@/prisma/services/user';
import { validateSession } from '@/config/api-validation';



const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'GET') {
        const page = req.query.page === 0 || req.query.page === 1 ? 1 : req.query.page;

        const log = await getActivity(req.query.id, req.query.page)
        return res.status(200).json({ log });
    }
};


export default handler;
