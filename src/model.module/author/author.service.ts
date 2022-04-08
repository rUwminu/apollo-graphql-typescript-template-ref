import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Ctx from 'src/types/context.type';
import { Author, AuthorDocument } from './author.schema';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  async findById(id) {
    return this.authorModel.findById(id).lean();
  }

  async findMany(context: Ctx) {
    const tempInfo = context.req.headers.tempinfo;

    console.log(tempInfo);

    return this.authorModel.find().lean();
  }

  async createAuthor(input) {
    return this.authorModel.create(input);
  }
}
