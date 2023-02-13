import { ask } from '@/lib/server/ai/openai';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {

        const { prompt } = req.body
        const session = await validateSession(req, res);

        const data = await ask(prompt);

        res.status(200).json({ data });
    }
};

export default handler;
