import { updateModule } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'PUT') {
        try {
            const session = await validateSession(req, res);
            if (session) {
                const { id, data } = req.body;

                const modules = await updateModule(id, data);
                res.status(200).json({ modules });
            }
        } catch (error) {
            res.status(400).json({ error: "Bad request - Error Code: 400" });
        }
    }
};

export default handler;
