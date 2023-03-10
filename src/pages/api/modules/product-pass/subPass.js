import { createSubPass, updateSubPass } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'POST') {
        const { workspaceid, moduleid, data } = req.body;
        const pass = await createSubPass(session.user.userId, session.user.email, workspaceid, moduleid, data);
        return res.status(200).json({ data: pass });
    } else if (method === 'PUT') {
        const { id, data } = req.body;
        const pass = await updateSubPass(id, data);
        return res.status(200).json({ data: pass });
    }
};


export default handler;
