import { captureContactActivities } from '@/prisma/services/log';
import { searchDocuments, searchAllDocuments } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';



const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'GET') {

        const documents = await searchAllDocuments(req.query.title, req.query.type)
        return res.status(200).json({ documents });
    }

    if (method === 'POST') {
        const { id, title, type } = req.body;

        const documents = await searchDocuments(id, title, type)
        return res.status(200).json({ documents });
    }
};


export default handler;
