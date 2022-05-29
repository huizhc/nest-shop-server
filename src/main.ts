/*
 * @Author: huizhc 1125133876@qq.com
 * @Date: 2022-02-10 09:16:55
 * @LastEditors: huizhc 1125133876@qq.com
 * @LastEditTime: 2022-05-28 14:45:13
 * @FilePath: \【源码】nestxiaomi\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from "path";
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  //配置cookie中间件
  app.use(cookieParser("this signed cookies"));
  app.enableCors({
    origin:"http://localhost:9528",
    credentials:true
  });
  //配置session的中间件
  app.use(session({ 
    secret: 'keyboard cat',
    resave:true, 
    saveUninitialized:true, 
    cookie: { maxAge: 1000*60*30,httpOnly:true },
    rolling:true 
  }));
  
  await app.listen(3000);
}
bootstrap();
