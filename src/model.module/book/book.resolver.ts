import Ctx from 'src/types/context.type';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Author } from 'src/model.module/author/author.schema';
import { Book, CreateBookInput, FindBookInput } from './book.schema';

import { BookService } from './book.service';
import { AuthorService } from '../author/author.service';

@Resolver(() => Book)
export class BookResolver {
  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
  ) {}

  @Query(() => [Book]) // <--- What will return look like
  async getAllBooks(@Context() context: Ctx) {
    // <--- Query name
    return this.bookService.findMany(context);
  }

  @Query(() => Book)
  async getSingleBook(@Args('input') { _id }: FindBookInput) {
    return this.bookService.findById(_id);
  }

  @Mutation(() => Book)
  async createNewBook(@Args('input') input: CreateBookInput) {
    return this.bookService.createBook(input);
  }

  @ResolveField(() => Author)
  async author(@Parent() book: Book) {
    return this.authorService.findById(book.author);
  }
}
