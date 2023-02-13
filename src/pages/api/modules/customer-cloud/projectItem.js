import { createProjectItem, updateProjectItem, getInvoice, getProjectItems, deleteInvoice, updateProjectBoardPosition } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'POST') {
        const { formInput } = req.body;

        const projectItem = await createProjectItem(session.user.userId, session.user.email, formInput);
        if (projectItem.count === 1) {
            res.status(200).json({ projectItem });

        } else {
            res.status(400).json({ error: "Bad request - Error Code: 400" });
        }


    } else if (method === 'PUT') {
        const { formInput, itemId } = req.body;

        const projectItem = await updateProjectBoardPosition(itemId, session.user.userId, session.user.email, formInput);
        res.status(200).json({ projectItem });

    } else if (method === 'DELETE') {

        const projectItem = await deleteInvoice(req.query.id);
        res.status(200).json({ projectItem });

    } else if (method === 'GET') {

        const projectItem = await getProjectItems(req.query.productItemId);
        res.status(200).json({ projectItem });
    }
};

export default handler;
