import {
  validateUpdateEmail,
  validateSession,
} from '@/config/api-validation/index';
import { updateApi } from '@/prisma/services/user';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await validateSession(req, res);
    await validateUpdateEmail(req, res);
    const { email, apiKey, apiSecret } = req.body;
    await updateApi(session.user.userId, email, session.user.email, apiKey, apiSecret);
    res.status(200).json({ data: { email } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
