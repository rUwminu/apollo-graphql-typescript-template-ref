import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
//import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(
  //   cors({
  //     origin: '*',
  //     credentials: true,
  //     exposedHeaders: ['set-cookie'],
  //   }),
  // );

  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    );
    // Request headers you wish to allow
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin,X-Requested-With,content-type,set-cookie',
    );
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });

  app.use(cookieParser());

  await app.listen(4000);
}
bootstrap();
