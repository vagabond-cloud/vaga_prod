import { createTicket, deleteTicket, updateTicket, getTicket } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'POST') {
        const { formInput } = req.body;

        const ticket = await createTicket(session.user.userId, session.user.email, formInput);
        if (ticket.count === 1) {
            res.status(200).json({ ticket });

        } else {
            res.status(400).json({ error: "Bad request - Error Code: 400" });
        }
    } else if (method === 'PUT') {
        const { formInput } = req.body;

        const ticket = await updateTicket(session.user.userId, session.user.email, formInput);
        res.status(200).json({ ticket });

    } else if (method === 'DELETE') {

        const ticket = await deleteTicket(req.query.ticketId);
        res.status(200).json({ ticket });

    } else if (method === 'GET') {

        const ticket = await getTicket(req.query.ticketId);
        res.status(200).json({ ticket });

    }
};

export default handler;
