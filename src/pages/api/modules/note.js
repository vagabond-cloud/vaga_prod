import { createNote, deleteNote } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {

        const session = await validateSession(req, res);
        const { contactId, note, title } = req.body;

        const newNote = await createNote(session.user.userId, session.user.email, contactId, note, title);
        if (newNote.count === 1) {
            res.status(200).json({ newNote });
        } else {
            res.status(400).json({ error: "Bad request - Error Code: 400" });
        }
    } else if (method === 'DELETE') {

        const note = await deleteNote(req.query.noteId);
        if (note.status === 200) {
            res.status(200).json({ note });
        } else {
            res.status(400).json({ error: "Bad request - Error Code: 400" });
        }
    }
};

export default handler;
