import { createCompany, updateCompany } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'PUT') {

        const session = await validateSession(req, res);

        const { formInput, workspaceId, moduleId } = req.body;

        const modules = await createCompany(session.user.userId, session.user.email, formInput, workspaceId, moduleId);
        if (modules.count === 1) {
            res.status(200).json({ modules });
        } else {
            res.status(400).json({ error: "Bad request - Error Code: 400" });
        }
    } else if (method === 'POST') {

        const session = await validateSession(req, res);

        const { id, formInput, workspaceId, moduleid } = req.body;

        const modules = await updateCompany(id, session.user.userId, session.user.email, formInput, workspaceId, moduleid);

        if (modules) {
            res.status(200).json({ modules });
        } else {
            res.status(400).json({ error: "Bad request - Error Code: 400" });
        }

    }
};

export default handler;
