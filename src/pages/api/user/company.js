import {
  validateUpdateCompany,
  validateSession,
} from '@/config/api-validation/index';
import { updateCompany } from '@/prisma/services/user';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await validateSession(req, res);
    await validateUpdateCompany(req, res);
    const { company } = req.body;
    await updateCompany(session.user.userId, company);
    res.status(200).json({ data: { company } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
