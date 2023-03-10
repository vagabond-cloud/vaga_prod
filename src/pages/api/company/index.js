import { createCompany } from '@/prisma/services/company';
import { validateSession } from '@/config/api-validation';
import api from '@/lib/common/api';

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'GET') {

        const session = await validateSession(req, res);

        const comps = await api(`https://api.crunchbase.com/api/v4/autocompletes?query=${req.query.name}&user_key=${process.env.NEXT_PUBLIC_CHRUNCHBASE_API}`,
            {
                method: 'GET'
            })
        // const log = await captureLog(title, description, action, ip, session.user.userId);

        res.status(200).json({ comps });
    } else if (method === 'POST') {
        const session = await validateSession(req, res);
        const { data } = req.body;

        const company = await createCompany(session.user.userId, session.user.email, data);


        res.status(200).json({ company });
    } else {
        res.status(400).json({ message: 'Bad Request' });
    }
}

export default handler;
