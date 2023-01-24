import { createCompany, updateCompany } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handleSession = async (req, res) => {
    return validateSession(req, res);
}

const handleResponse = (res, modules) => {
    if (modules) {
        res.status(200).json({ modules });
    } else {
        res.status(400).json({ error: "Bad request - Error Code: 400" });
    }
}

const handler = async (req, res) => {
    const { method } = req;
    const { formInput, workspaceId, moduleId } = req.body;
    let modules;
    const session = await handleSession(req, res);

    if (method === 'PUT') {
        modules = await createCompany(session.user.userId, session.user.email, formInput, workspaceId, moduleId);
    } else if (method === 'POST') {
        const { id } = req.body;
        modules = await updateCompany(id, session.user.userId, session.user.email, formInput, workspaceId, moduleId);
    }
    handleResponse(res, modules);
};

export default handler;
