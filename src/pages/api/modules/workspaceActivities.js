import { captureContactActivities } from '@/prisma/services/log';
import { getActivities } from '@/prisma/services/user';
import { validateSession } from '@/config/api-validation';



const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'GET') {
        const page = req.query.page === "0" ? "1" : req.query.page;

        const log = await getActivities(page, 10, { "createdAt": "desc" }, req.query.id)
        return res.status(200).json({ log });
    }
};


export default handler;
