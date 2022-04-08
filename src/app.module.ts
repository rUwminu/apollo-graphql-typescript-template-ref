import { get, set } from 'lodash';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppService } from './app.service';
import { AuthorModule } from './model.module/author/author.module';
import { BookModule } from './model.module/book/book.module';
import { UserModule } from './model.module/user/user.module';
import { decode } from './utils/jwt.utils';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nestjs-graphql'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (_, websocket, context) => {
            const cookie = websocket.upgradeReq.headers.cookie;
            const parts = cookie.split('=');
            const credential = parts[1];

            if (credential) {
              const subscribeUser = decode(credential);

              return {
                user: subscribeUser,
              };
            }

            throw new Error('Missing auth token!');
          },
          path: '/graphql',
        },
      },
      context: ({ req, res }) => {
        const token = get(req, 'cookies.token');

        const user = token ? decode(get(req, 'cookies.token')) : null;

        // Attach the user object to the request object
        if (user) {
          set(req, 'user', user);
        }

        return { req, res };
      },
    }),
    AuthorModule,
    BookModule,
    UserModule,
  ],
  providers: [AppService],
})
export class AppModule {}
