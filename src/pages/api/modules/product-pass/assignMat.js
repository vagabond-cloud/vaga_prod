import { assignMaterial, deleteAssignMaterial } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'POST') {
        const { workspaceid, moduleid, data } = req.body;
        const material = await assignMaterial(session.user.userId, session.user.email, workspaceid, moduleid, data);
        return res.status(200).json({ data: material });
    } else if (method === 'PUT') {
        const { id, data } = req.body;
        const material = await updateMaterial(id, data);
        return res.status(200).json({ data: material });
    } else if (method === 'DELETE') {
        const { id } = req.body;
        const material = await deleteAssignMaterial(id);
        return res.status(200).json({ data: material });
    }
};


export default handler;
