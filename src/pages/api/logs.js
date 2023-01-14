import { captureLog } from '@/prisma/services/log';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {

        const session = await validateSession(req, res);

        const { title, description, action, ip } = req.body;

        const log = await captureLog(title, description, action, ip, session.user.userId);

        res.status(200).json({ log });
    }
};

export default handler;
