import { gateway } from '@/lib/server/gateway';
import { createSession } from '@/prisma/services/gateway';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {
        try {
            const { blob } = req.body;
            console.log(blob)
            const result = await gateway(blob)
            await createSession(result)
            res.status(200).json({ data: result });
        } catch (error) {
            res.status(500).json({ error });
        }
    } else {
        res.status(500).json({ error: "Method not allowed" });
    }
};

export default handler;
