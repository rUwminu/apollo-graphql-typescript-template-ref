import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@Schema()
@ObjectType()
export class User {
  @Field(() => ID)
  _id: number;

  @Prop({ required: true, unique: true }) // <--- Mongoose Type
  @Field() // <--- Graphql
  email: string; // <--- TypeScript

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: false })
  @Field()
  active: boolean;

  comparePassword: (candidatePassword: string) => boolean;
}

export type UserDocument = User & mongoose.Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }); // <--- query by email, this make query email faster

UserSchema.pre('save', async function (next) {
  let user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // Random additional data
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
