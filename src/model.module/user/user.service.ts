import { omit } from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserInput, LoginInput, User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import Ctx from 'src/types/context.type';
import { signJwt } from 'src/utils/jwt.utils';
import { CookieOptions } from 'express';

const cookieOptions: CookieOptions = {
  domain: 'localhost', // <--- set to client domain ip/url
  secure: false,
  sameSite: 'strict',
  httpOnly: true,
  path: '/',
};

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async signUser({ email, password }: LoginInput, context: Ctx) {
    const user = await this.userModel
      .findOne({ email })
      .select('-__v -confirmToken');

    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }

    if (!user.active) throw new Error('Please confrim your email address');

    const jwt = signJwt(omit(user.toJSON(), ['password', 'active']));

    // Create and return cookie to client
    context.res.cookie('token', jwt, cookieOptions);

    return user;
  }

  async createUser(input: CreateUserInput) {
    return this.userModel.create({ ...input, active: true });
  }

  async checkNeedReturn(payload, user) {
    // Perform user check or other checking required to return the subscription data.

    //console.log(payload);
    //console.log(user);

    return true;
  }
}
