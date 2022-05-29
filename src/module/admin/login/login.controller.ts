import { CookieService } from './../../../service/cookie/cookie.service';
import {
  Controller,
  Get,
  Render,
  Request,
  Response,
  Post,
  Body,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ToolsService } from '../../../service/tools/tools.service';

import { AdminService } from '../../../service/admin/admin.service';

import { Config } from '../../../config/config';
import { MessageType, ResultData } from '../../../common/result/ResultData';

@Controller(`${Config.adminPath}/login`)
export class LoginController {
  constructor(
    private toolsService: ToolsService,
    private adminService: AdminService,
    private cookieService: CookieService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @Render('admin/login')
  async index() {
    // console.log(await this.adminService.find());
    return {};
  }
  @Post('info')
  async info(@Request() req, @Body() body) {
    try {
      let userInfo = await this.jwtService.verify(body.token);
      if (!userInfo) return new ResultData('请先登录', null, false);

      // let userInfo=this.cookieService.get(req,'userinfo');
      return new ResultData('操作成功', userInfo, true);
    } catch (error) {
      return new ResultData(error.errorMessage, null, false);
    }
  }

  @Get('code')
  getCode(@Request() req, @Response() res) {
    var svgCaptcha = this.toolsService.getCaptcha();

    //设置session
    req.session.code = svgCaptcha.text;

    res.type('image/svg+xml');

    res.send(svgCaptcha.data);
  }

  @Post('doLogin')
  async doLogin(@Body() body, @Request() req, @Response() res) {
    try {
      var code: string = body.code;
      var username: string = body.username;
      var password: string = body.password;
      if (username == '' || password.length < 6) {
        this.toolsService.error(
          res,
          '用户名或者密码不合法',
          `/${Config.adminPath}/login`,
        );
      } else {
        if (code.toUpperCase() == req.session.code.toUpperCase()) {
          password = this.toolsService.getMd5(password);
          var userResult = await this.adminService.find({
            username: username,
            password: password,
          });
          if (userResult.length > 0) {
            console.log('登录成功');
            req.session.userinfo = userResult[0];
            this.toolsService.success(res, `/${Config.adminPath}/main`);
          } else {
            this.toolsService.error(
              res,
              '用户名或者密码不正确',
              `/${Config.adminPath}/login`,
            );
          }
        } else {
          this.toolsService.error(
            res,
            '验证码不正确',
            `/${Config.adminPath}/login`,
          );
        }
      }
    } catch (error) {
      console.log(error);

      res.redirect(`${Config.adminPath}/login`);
    }
  }
  @Post()
  async login(@Body() body, @Request() req) {
    try {
      var code: string = body.code;
      var username: string = body.username;
      var password: string = body.password;
      if (username == '' || password.length < 6) {
        return new ResultData('用户名或者密码不合法', body, false);
        // this.toolsService.error(res,"用户名或者密码不合法",`/${Config.adminPath}/login`);
      } else {
        if (code.toUpperCase() == req.session.code.toUpperCase()) {
          password = this.toolsService.getMd5(password);
          var userResult = await this.adminService.find({
            username: username,
            password: password,
          });
          if (userResult.length > 0) {
            console.log('登录成功');
            req.session.userinfo = userResult[0];
            const token = this.jwtService.sign({
              id: userResult[0]._id,
              username: userResult[0].username,
            });
            return new ResultData('登录成功', token, true);
            // this.toolsService.success(res,`/${Config.adminPath}/main`);
          } else {
            return new ResultData('用户名或者密码不正确', null, false);
            // this.toolsService.error(res,"用户名或者密码不正确",`/${Config.adminPath}/login`);
          }
        } else {
          return new ResultData('验证码不正确', null, false);
          // this.toolsService.error(res,"验证码不正确",`/${Config.adminPath}/login`);
        }
      }
    } catch (error) {
      console.log(error);
      return new ResultData('系统繁忙', body, false);

      // res.redirect(`${Config.adminPath}/login`);
    }
  }
  /*
   
     注意：1、需要在前端页面用js验证用户输入的信息是否正确     2、后台获取数据以后判断数据格式是否正确



     1、获取表单提交的数据 

     2、判断验证码是否正确

     验证码正确

         1、要对表单里面的密码进行md5加密               md5模块  https://www.npmjs.com/package/md5

                                                           1、安装 cnpm install md5 --save

                                                           2、引入 md5 var md5 = require('md5');

                                                           3、使用  md5(str)


         2、在用户表（集合）中查询当前用户是否存在              （mongoose操作mongodb数据库）https://docs.nestjs.com/techniques/mongodb

                                                                 1、配置mongoose

                                                                 2、创建操作数据库的model


         3、如果数据库有此用户（登录成功） ：保存用户信息     跳转到后台管理系统

         4、如果数据库有此用户（登录失败）： 跳转到登录页面


      验证码错误： 跳转到登录页面   提示验证码不正确

     */

  //   @Get('loginOut')
  //   loginOut(@Request() req, @Response() res) {
  //     req.session.userinfo = null;
  //     res.redirect(`${Config.adminPath}/login`);
  //   }
  @Post('logout')
  handleLoginOut(@Request() req) {
    console.log(222);

    req.session.userinfo = null;
    // res.redirect(`${Config.adminPath}/login`);
    return new ResultData('操作成功', null, true);
  }
}
