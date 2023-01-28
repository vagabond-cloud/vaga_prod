import { captureContactActivities } from '@/prisma/services/log';
import { updateCRMSettings, createCRMSettings } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'POST') {
        const { workspaceId, moduleId, formInput } = req.body;
        const settings = await createCRMSettings(workspaceId, moduleId, formInput);
        return res.status(200).json({ settings });

    } else if (method === 'PUT') {
        const { workspaceId, moduleId, formInput, id } = req.body;
        const settings = await updateCRMSettings(workspaceId, moduleId, formInput, id);
        return res.status(200).json({ settings });

    } else if (method === 'GET') {
        const settings = await getCRMSettings(req.query.id)
        return res.status(200).json({ settings });
    }
};


export default handler;
