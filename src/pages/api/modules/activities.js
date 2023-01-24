import { captureContactActivities } from '@/prisma/services/log';
import { getActivity, getAllActivities } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';



const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'POST') {
        const { title, description, action, ip, contactId } = req.body;
        const log = await captureContactActivities(title, description, action, ip, session.user.userId, contactId);
        return res.status(200).json({ log });
    } else if (method === 'GET') {
        const log = await getActivity(req.query.id, req.query.page)
        return res.status(200).json({ log });
    }
};


export default handler;
