import { Request, Response } from 'express';
import { User } from '../model.module/user/user.schema';

type Ctx = {
  req: Request & { user: Pick<User, 'email' | 'name'> };
  res: Response;
};

export default Ctx;
