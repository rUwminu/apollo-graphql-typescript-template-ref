import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Book } from '../book/book.schema';

export type AuthorDocument = Author & mongoose.Document;

@Schema()
@ObjectType()
export class Author {
  @Field(() => ID)
  _id: string;

  @Prop()
  @Field()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  @Field(() => [Book])
  books: Book[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);

@InputType()
export class CreateAuthorInput {
  @Field()
  name: string;
}
