import {
    validateSession,
} from '@/config/api-validation/index';
import { getActivities } from '@/prisma/services/user'

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {

        const { workspaceSlug, id, email } = req.query;

        const session = await validateSession(req, res);


        const activities = await getActivities(id);
        res.status(200).json({ data: { activities } });
    } else {
        res
            .status(405)
            .json({ errors: { error: { msg: `${method} method unsupported` } } });
    }
};

export default handler;
