import { getAllUsers } from '@/prisma/services/user';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {

        const session = await validateSession(req, res);

        const { page, limit, sort } = req.body;

        const { users, total } = await getAllUsers(page, limit, sort);

        res.status(200).json({ users, total });

    }
};

export default handler;
