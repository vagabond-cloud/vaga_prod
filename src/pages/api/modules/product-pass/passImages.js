import { createProductPassImage, updateProductPassImage } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'POST') {
        const { workspaceid, moduleid, data, type, size, name } = req.body;

        if (type.includes('image')) {
            const image = await createProductPassImage(session.user.userId, session.user.email, workspaceid, moduleid, data, type, size, name);
            return res.status(200).json({ data: image });
        } else {
            return res.status(401).json({ error: "image" });

        }
    } else if (method === 'PUT') {
        const { id, data } = req.body;
        const pass = await updateProductPassImage(id, data);
        return res.status(200).json({ data: pass });
    }
};


export default handler;
