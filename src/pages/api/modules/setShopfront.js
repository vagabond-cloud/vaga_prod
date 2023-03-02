import { updateModule } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'PUT') {
        try {
            const session = await validateSession(req, res);
            if (session) {
                const { id, oldId, data } = req.body;

                const setDeactive = await updateModule(oldId, { active: false });

                const setActive = await updateModule(id, { active: true });
                res.status(200).json({ setActive });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

export default handler;
