import Ctx from 'src/types/context.type';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Book } from 'src/model.module/book/book.schema';
import { Author, CreateAuthorInput } from './author.schema';

import { AuthorService } from './author.service';
import { UserService } from '../user/user.service';
import { BookService } from '../book/book.service';

const pubsub = new PubSub();

@Resolver(() => Author)
export class AuthorResolver {
  constructor(
    private userService: UserService,
    private authorService: AuthorService,
    private bookService: BookService,
  ) {}

  @Query(() => [Author])
  async getAllAuthors(@Context() context: Ctx) {
    return this.authorService.findMany(context);
  }

  @Mutation(() => Author)
  async createNewAuthor(@Args('input') input: CreateAuthorInput) {
    const newAuthor = this.authorService.createAuthor(input);
    pubsub.publish('authorAdded', { authorAdded: newAuthor });

    return newAuthor;
  }

  @Subscription(() => Author, {
    name: 'authorAdded',
    async resolve(this: AuthorResolver, payload, variables, context) {
      const { user } = context;

      const tempObj = await payload.authorAdded;

      if (user) {
        const toReturn = await this.userService.checkNeedReturn(tempObj, user);

        console.log(toReturn);

        return payload.authorAdded;
      }
    },
  })
  async authorAdded() {
    return await pubsub.asyncIterator('authorAdded');
  }

  // Sevices allow other resolver to perform function from other services file
  @ResolveField(() => [Book])
  async books(@Parent() author: Author) {
    return this.bookService.findByAuthorId(author._id);
  }
}
