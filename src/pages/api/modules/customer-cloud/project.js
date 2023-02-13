import { createProject, updateInvoice, getInvoice, getInvoices, deleteInvoice } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'POST') {
        const { formInput } = req.body;

        const project = await createProject(session.user.userId, session.user.email, formInput);
        if (project.count === 1) {
            res.status(200).json({ project });

        } else {
            res.status(400).json({ error: "Bad request - Error Code: 400" });
        }
    } else if (method === 'PUT') {
        const { formInput, invoiceId } = req.body;

        const project = await updateInvoice(invoiceId, session.user.userId, session.user.email, formInput);
        res.status(200).json({ project });

    } else if (method === 'DELETE') {

        const project = await deleteInvoice(req.query.id);
        res.status(200).json({ project });

    } else if (method === 'GET') {

        if (req.query.all === '1') {

            const project = await getInvoices(req.query.dealId, true);
            res.status(200).json({ project });
        } else {
            const project = await getInvoice(req.query.dealId);

            res.status(200).json({ project });
        }
    }
};

export default handler;
