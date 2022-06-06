/*
 * @Author: huizhc 1125133876@qq.com
 * @Date: 2022-02-10 09:16:55
 * @LastEditors: huizhc 1125133876@qq.com
 * @LastEditTime: 2022-05-30 21:34:58
 * @FilePath: \【源码】nestxiaomi\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
var bodyParser = require('body-parser');
var ueditor = require('ueditor');

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

  // /ueditor 入口地址配置 https://github.com/netpi/ueditor/blob/master/example/public/ueditor/ueditor.config.js
  // 官方例子是这样的 serverUrl: URL + "php/controller.php"
  // 我们要把它改成 serverUrl: URL + 'ue'
  app.use(
    '/ueditor/ue',
    ueditor(path.join(__dirname, 'public'), function (req, res, next) {
      // ueditor 客户发起上传图片请求

      if (req.query.action === 'uploadimage') {
        // 这里你可以获得上传图片的信息
        var foo = req.ueditor;
        console.log(foo.filename); // exp.png
        console.log(foo.encoding); // 7bit
        console.log(foo.mimetype); // image/png

        // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
        var img_url = 'ueditor/save';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
      }
      //  客户端发起图片列表请求
      else if (req.query.action === 'listimage') {
        var dir_url = 'ueditor/images'; // 要展示给客户端的文件夹路径
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
      }
      // 客户端发起其它请求
      else {
        res.setHeader('Content-Type', 'application/json');
        // 这里填写 ueditor.config.json 这个文件的路径
        res.redirect('/ueditor/ueditor.config.json');
      }
    }),
  );

  /**百度富文本 end */

  //配置cookie中间件
  app.use(cookieParser('this signed cookies'));
  app.enableCors({
    origin: 'http://localhost:9528',
    credentials: true,
  });
  //配置session的中间件
  app.use(
    session({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 30, httpOnly: true },
      rolling: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
