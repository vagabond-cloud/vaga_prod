import { captureContactActivities } from '@/prisma/services/log';
import { assignDeal } from '@/prisma/services/modules';
import { validateSession } from '@/config/api-validation';
import { sendMail } from '@/lib/server/mail';
import { html, text } from '@/config/email-templates/deal-assigned';



const handler = async (req, res) => {
    const { method } = req;
    const session = await validateSession(req, res);

    if (method === 'POST') {
        const { dealId, userId, email } = req.body;
        const log = await assignDeal(dealId, userId);
        await sendMail({
            html: html({ email }),
            subject: `Vagabond - You have been assigned a deal`,
            text: text({ email }),
            to: [email, session.user.email],
        });
        return res.status(200).json({ log });
    } else if (method === 'GET') {
        const log = await assignDeal(req.query.id, req.query.page)
        return res.status(200).json({ log });
    }
};


export default handler;
