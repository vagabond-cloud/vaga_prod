import { createNote, deleteNote } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'PUT') {

        const session = await validateSession(req, res);


        const { contactId, note, title } = req.body;

        const modules = await createNote(session.user.userId, session.user.email, contactId, note, title);
        if (modules.count === 1) {
            res.status(200).json({ modules });
        } else {
            res.status(400).json({ error: "Bad request - Error Code: 400" });
        }
    } else if (method === 'DELETE') {

        const note = await deleteNote(req.query.contactId);
        res.status(200).json({ note });

    }
};

export default handler;
