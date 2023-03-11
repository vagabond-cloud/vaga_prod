import { createModule } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'PUT') {

        const session = await validateSession(req, res);

        const { name, network, workspace, type } = req.body;

        const modules = await createModule(session.user.userId, session.user.email, name, network, workspace, type);
        if (modules.count === 1) {
            res.status(200).json({ modules });
        } else {
            res.status(400).json({ error: "Bad request - Error Code: 400" });
        }
    }
};

export default handler;
