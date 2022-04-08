import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Author, AuthorSchema } from 'src/model.module/author/author.schema';
import { AuthorService } from 'src/model.module/author/author.service';
import { BookResolver } from './book.resolver';
import { Book, BookSchema } from './book.schema';
import { BookService } from './book.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Author.name, schema: AuthorSchema },
    ]),
  ],
  providers: [BookResolver, BookService, AuthorService],
})
export class BookModule {}
