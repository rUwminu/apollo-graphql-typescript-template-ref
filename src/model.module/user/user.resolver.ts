import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import Ctx from 'src/types/context.type';
import { CreateUserInput, LoginInput, User } from './user.schema';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { nullable: true })
  async loginUser(@Args('input') input: LoginInput, @Context() context: Ctx) {
    return this.userService.signUser(input, context);
  }

  @Query(() => User, { nullable: true })
  async me(@Context() context: Ctx) {
    return context.req.user;
  }

  @Mutation(() => User)
  async registerUser(@Args('input') input: CreateUserInput) {
    return this.userService.createUser(input);
  }
}
