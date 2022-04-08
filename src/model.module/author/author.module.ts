import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from 'src/model.module/book/book.schema';
import { BookService } from 'src/model.module/book/book.service';
import { User, UserSchema } from 'src/model.module/user/user.schema';
import { UserService } from 'src/model.module/user/user.service';
import { AuthorResolver } from './author.resolver';
import { Author, AuthorSchema } from './author.schema';
import { AuthorService } from './author.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }, // <--- Add model references for query
      { name: Book.name, schema: BookSchema },
      { name: Author.name, schema: AuthorSchema },
    ]),
  ],
  providers: [AuthorResolver, AuthorService, BookService, UserService], // <--- Add services to allow module to be use
})
export class AuthorModule {}
