import { createWallet } from '@/lib/server/vagachain/address';
import { validateSession } from '@/config/api-validation';
import { updateAddress } from '@/prisma/services/user';
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
    const { method } = req;

    if (method === 'GET') {
        try {
            const session = await validateSession(req, res);
            const wallet = await createWallet();
            const mnemonic = CryptoJS.AES.encrypt(wallet.mnemonic, process.env.UNLOCK_KEY).toString();

            res.status(200).json({ data: { address: wallet.address, mnemonic, raw: wallet.mnemonic } });
        } catch (error) {
            res.status(500).json({ error });
        }
    } else if (method === 'POST') {
        try {
            const session = await validateSession(req, res);
            const { address, mnemonic } = req.body;

            const wallet = await updateAddress(session.user.userId, address, mnemonic)

            res.status(200).json({ data: wallet });
        } catch (error) {
            res.status(500).json({ error });
        }
    } else {
        res.status(500).json({ error: "Method not allowed" });
    }
};

export default handler;
