import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
var bodyParser = require('body-parser');
import * as xmlparser from 'express-xml-bodyparser'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //配置静态资源目录
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  //配置模板引擎
  app.setBaseViewsDir('views');
  app.setViewEngine('ejs');

  /**swagger start */

  const options = new DocumentBuilder()
    .setTitle('blog-serve')
    .setDescription('接口文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger-doc', app, document);

  /**swagger end */

  /**百度富文本 start */

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(bodyParser.json());


  //配置cookie中间件
  app.use(cookieParser('this signed cookies'));
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
});
// http://localhost:8080
// app.enableCors({
//   origin: 'http://127.0.0.1:6379',
//   credentials: true,
// });
  //配置session的中间件
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 30, httpOnly: true },
      rolling: true,
    }),
  );
  app.use(xmlparser());

  await app.listen(3000);
}
bootstrap();
