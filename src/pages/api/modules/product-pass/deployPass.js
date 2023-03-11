import { deployPass } from '@/lib/server/vagachain/productPass'
import CryptoJS from 'crypto-js';
import { updateProductPass } from '@/prisma/services/modules';
const handler = async (req, res) => {
    const { method } = req;

    if (method === 'POST') {
        const { id } = req.body;
        const decrypt = CryptoJS.AES.decrypt(process.env.PRODUCT_PASS_MNEMONIC, process.env.UNLOCK_KEY).toString(CryptoJS.enc.Utf8);
        const deploy = await deployPass(decrypt);

        const updateContract = await updateProductPass(id, { contractAddress: deploy });
        console.log(updateContract)
        return res.status(200).json({ data: deploy });
    } else {
        return res.status(200).json({ data: 'Method not allowed' });
    }
};


export default handler;
