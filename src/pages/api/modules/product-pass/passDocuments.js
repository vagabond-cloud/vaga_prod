import { createProductPassDoc, updateProductPassImage, deleteProductPassDoc } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'POST') {
        const { workspaceid, moduleid, data, type, size, name } = req.body;

        const image = await createProductPassDoc(session.user.userId, session.user.email, workspaceid, moduleid, data, type, size, name);
        return res.status(200).json({ data: image });

    } else if (method === 'PUT') {
        const { id, data } = req.body;
        const doc = await updateProductPassImage(id, data);
        return res.status(200).json({ data: doc });
    } else if (method === 'DELETE') {
        const { id, data } = req.body;
        const doc = await deleteProductPassDoc(id, data);
        return res.status(200).json({ data: doc });
    }
};


export default handler;
