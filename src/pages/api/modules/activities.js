import { captureContactActivities } from '@/prisma/services/log';
import { getActivity, getAllActivities } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {

        const session = await validateSession(req, res);

        const { title, description, action, ip, contactId } = req.body;

        const log = await captureContactActivities(title, description, action, ip, session.user.userId, contactId);

        res.status(200).json({ log });

    } else if ('GET') {

        const session = await validateSession(req, res);

        const log = await getActivity(req.query.id, req.query.page)

        res.status(200).json({ log });
    }
};

export default handler;
