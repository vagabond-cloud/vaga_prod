import { updatePhoto } from '@/prisma/services/modules';
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
    const { logoUrl } = req.body;
    let modules;
    const session = await handleSession(req, res);

    if (method === 'POST') {
        const { id } = req.body;
        modules = await updatePhoto(id, logoUrl);
    }
    handleResponse(res, modules);
};

export default handler;
